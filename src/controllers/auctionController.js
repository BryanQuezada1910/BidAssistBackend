import Auction from "../models/Auction.js";

// Method: GET
// Get all auctions
export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("ownerUser")
      .populate("currentBider")
      .populate("bidders");
    res.status(200).json(auctions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Method: GET
// Get auctions by categorie whit status active
export const getAuctionsByStatusAndCategory = async (req, res) => {
  const { status, category } = req.query;
  try {
    let query = { status: status };
    // If category is provided, add it to the query
    if (category) {
      query.category = category;
    }

    const auctions = await Auction.find(query);
    console.log(auctions);
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
    !initialPrice ||
    !minimumBid ||
    !category ||
    !startDate ||
    !endDate ||
    !ownerUser
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create a new auction
  const auction = new Auction({
    title,
    description,
    product: {
      name: product.name,
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
      auction.minimunBid = req.body.minimunBid;
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
