import { isValidObjectId } from "mongoose";

import Auction from "../models/Auction.js";
import { writeCache, clearCache } from "../services/redisService.js";
import { generateAuctionsKey } from "../utils/keysUtils.js";

// Method: GET
// Get all auctions
export const getAllAuctions = async (req, res) => {
  try {

    const user = req.session;
    const { status, category } = req.query;

    // Validate ownerId format
    if (user && !isValidObjectId(user.id)) {
      return res.status(400).send({ message: "Invalid owner ID" });
    }


    const query = {}

    if (user.isSuscribed) query.ownerUser = user.id;
    if (status) query.status = status;
    if (category) query.category = category;

    const auctions = await Auction.find(query)
      .populate("ownerUser")
      .populate("currentBider")
      .populate("bidders")
      .lean();

    if (!auctions.length) return res.status(404).send({ message: "No auctions found" });

    if (user.role) {
      await writeCache(generateAuctionsKey(req), auctions, {
        EX: 21600, // 6 horas
      });
    }
    res.status(200).json(auctions);

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.error(error);
  }
};


// Method: GET
// Get a single auction by id
export const getAuctionById = async (req, res) => {

  const { id } = req.params;

  if (!isValidObjectId(id)) return res.status(400).send({ message: "Invalid Auction ID" });

  try {
    const auction = await Auction.findById(id)
      .populate("ownerUser")
      .populate("currentBider")
      .populate("bidders")
      .lean();

    if (!auction) return res.status(404).json({ message: "Auction not found" });

    res.status(200).json(auction);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.error(error)
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
    res.status(500).send({ message: "Internal Server Error" });
    console.error(error);
  }
};

// Method: PUT
// Update an auction by id
export const updateAuction = async (req, res) => {

  const { id } = req.params;

  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).end();
  }

  if (!isValidObjectId(id)) return res.status(400).send({ message: "Invalid Auction ID" });

  try {

    let query = {};

    if (req.body.title) {
      query.title = req.body.title;
    }
    if (req.body.description) {
      query.description = req.body.description;
    }
    if (req.body.product) {
      query.product = req.body.product;
    }
    if (req.body.initialPrice) {
      query.initialPrice = req.body.initialPrice;
    }
    if (req.body.minimunBid) {
      query.minimumBid = req.body.minimunBid;
    }
    if (req.body.currentBid) {
      query.currentBid = req.body.currentBid;
    }
    if (req.body.category) {
      query.category = req.body.category;
    }
    if (req.body.startDate) {
      query.startDate = req.body.startDate;
    }
    if (req.body.endDate) {
      query.endDate = req.body.endDate;
    }

    const auction = await Auction.findByIdAndUpdate(id, query, { new: true });
    // Check if auction exists
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    await clearCache("Admin:auctions");
    res.status(200).json(auction);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.error(error);
  }
};

// Method: DELETE
// Delete an auction by id
export const deleteAuction = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return res.status(400).send({ message: "Invalid Auction ID" });

  try {
    const auction = await Auction.findById(id);

    if (!auction) return res.status(404).json({ message: "Auction not found" });

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
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.error(error);
  }
};

export default {
  getAllAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction,
};
