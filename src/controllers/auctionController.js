import { isValidObjectId } from "mongoose";

import Auction from "../models/Auction.js";
import { writeCache, requestToKey, clearCache, readCache } from "../services/redisService.js";
import { generateAuctionsKey } from "../utils/keysUtils.js";

// Method: GET
// Get all auctions
export const getAllAuctions = async (req, res) => {
  try {

    const user = req.session;
    console.log("user:auction ", user)
    const { status, category } = req.query;

    // Validate ownerId format
    if (user && !isValidObjectId(user.id)) {
      return res.status(400).send({ message: "Invalid owner ID" });
    }


    const query = {}

    // si el usuario está suscrito vamos a obtener solo sus subastas
    if (user.isSuscribed) query.ownerUser = user.id;

    if (status) query.status = status;

    if (category) query.category = category;


    console.log("query: ", query)
    const auctions = await Auction.find(query)
      .populate("ownerUser")
      .populate("currentBider")
      .populate("bidders");

    if (!auctions.length) return res.status(404).send({ message: "No auctions found" });


    // si se pidieron todas las subastas
    if (!status) {
      console.log("subastas paara admins")
      await writeCache(generateAuctionsKey(req), auctions, {
        EX: 21600, // 6 horas
      });
    } else if (status === "in progress") {
      console.log("subastas para no suscritos")
      await writeCache(generateAuctionsKey(req), auctions, {
        EX: 21600, // 6 horas
      });
    }

    res.status(200).json(auctions);

  } catch (error) {
    console.log(error)
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Method: GET
// Get auctions by categorie whit status active
export const getAuctionsByStatusAndCategory = async (req, res) => {
  const { status, category } = req.query;

  try {
    const query = { status: status };
    // If category is provided, add it to the query
    if (category) query.category = category;

    const auctions = await Auction.find(query);
    // If no auctions are found, return a 404 error
    if (auctions.length === 0) {
      return res.status(404).json({ message: "Auctions not found" });
    }

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Method: GET
// Get a single auction by id
export const getAuctionById = async (req, res) => {
  const { id } = req.params;
  try {
    const auction = await Auction.findById(id)
      .populate("ownerUser")
      .populate("currentBider")
      .populate("bidders");
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    res.status(200).json(auction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Method: POST
// Create a new auction
export const createAuction = async (req, res) => {
  // Check if required fields are missing

  const {
    title,
    description,
    product,
    initialPrice,
    minimumBid,
    category,
    startDate,
    endDate,
    ownerUser
  } = req.body;

  if (
    !title ||
    !description ||
    !product ||
    !product.name ||
    !product.images ||
    !initialPrice ||
    !minimumBid ||
    !category ||
    !startDate ||
    !endDate ||
    !ownerUser
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (new Date() > startDate || new Date() > endDate || startDate > endDate || startDate === endDate) {
    return res.status(400).json({ message: "Invalid dates" });
  }

  // Create a new auction
  const auction = new Auction({
    title,
    description,
    product: {
      name: product.name,
      images: product.images,
    },
    initialPrice,
    minimumBid,
    currentBid: initialPrice,
    category,
    startDate,
    endDate,
    ownerUser,
  });

  try {
    const newAuction = await auction.save();
    await clearCache("Admin:auctions");
    res.status(201).json(newAuction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Method: PUT
// Update an auction by id
export const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    // Check if auction exists
    if (auction == null) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Check if auction can be updated (20 minutes before start time)
    const now = new Date();
    const twentyMinutesBeforeStart = new Date(
      auction.startDate.getTime() - 20 * 60 * 1000
    );

    if (now >= twentyMinutesBeforeStart) {
      return res.status(400).json({
        message:
          "Auction cannot be updated within 20 minutes of its start time",
      });
    }

    // Check if auction has ended
    if (new Date() > auction.endDate) {
      return res.status(400).json({ message: "Auction has ended" });
    }

    // Check if auction is in progress
    if (req.body.status === "in progress") {
      return res
        .status(400)
        .json({ message: "Auction cannot be updated to in progress" });
    }

    if (req.body.title != null) {
      auction.title = req.body.title;
    }
    if (req.body.description != null) {
      auction.description = req.body.description;
    }
    if (req.body.product != null) {
      auction.product = req.body.product;
    }
    if (req.body.initialPrice != null) {
      auction.initialPrice = req.body.initialPrice;
    }
    if (req.body.minimunBid != null) {
      auction.minimumBid = req.body.minimunBid;
    }
    if (req.body.currentBid != null) {
      auction.currentBid = req.body.currentBid;
    }
    if (req.body.category != null) {
      auction.category = req.body.category;
    }
    if (req.body.startDate != null) {
      auction.startDate = req.body.startDate;
    }
    if (req.body.endDate != null) {
      auction.endDate = req.body.endDate;
    }

    const updatedAuction = await auction.save();



    await clearCache("Admin:auctions");
    await clearCache("not-suscribed:auctions");
    res.json(updatedAuction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Method: DELETE
// Delete an auction by id
export const deleteAuction = async (req, res) => {
  const { id } = req.params;
  try {
    const auction = await Auction.findById(req.params.id);
    if (auction == null) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const now = new Date();
    const twentyMinutesBeforeStart = new Date(
      auction.startDate.getTime() - 20 * 60 * 1000
    );

    if (
      auction.status === "in progress" ||
      auction.status === "ended" ||
      now >= twentyMinutesBeforeStart
    ) {
      return res.status(400).json({ message: "Auction cannot be deleted" });
    }

    await auction.deleteOne();


    await clearCache("Admin:auctions");
    res.json({ message: "Auction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  getAllAuctions,
  getAuctionsByStatusAndCategory,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction,
};
