import Auction from "../models/Auction";

// Path: src/controllers/auctionController.js
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

// Path: src/controllers/auctionController.js
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

// Path: src/controllers/auctionController.js
// Method: POST
// Create a new auction
export const createAuction = async (req, res) => {
  const auction = new Auction({
    title: req.body.title,
    description: req.body.description,
    product: req.body.product,
    initialPrice: req.body.initialPrice,
    minimunBid: req.body.minimunBid,
    currentBid: req.body.initialPrice,
    category: req.body.category,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    ownerUser: req.body.ownerUser,
  });

  try {
    const newAuction = await auction.save();
    res.status(201).json(newAuction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    // Check if auction exists
    if (auction == null) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Check if auction can be updated (20 minutes before start time)
    const now = new Date();
    const twentyMinutesBeforeStart = new Date(auction.startDate.getTime() - 20 * 60 * 1000);

    if (now >= twentyMinutesBeforeStart) {
      return res.status(400).json({
          message: "Auction cannot be updated within 20 minutes of its start time",
        });
    }

    // Check if auction has ended
    if (new Date() > auction.endDate) {
      return res.status(400).json({ message: "Auction has ended" });
    }

    // Check if auction is in progress
    if (req.body.status === "in progress") {
        return res.status(400).json({ message: "Auction cannot be updated to in progress" });
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

// Path: src/controllers/auctionController.js
// Method: DELETE
// Delete an auction by id
export const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (auction == null) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    const now = new Date();
    const twentyMinutesBeforeStart = new Date(auction.startDate.getTime() - 20 * 60 * 1000);

    if (auction.status === 'in progress' || auction.status === 'ended' || now >= twentyMinutesBeforeStart) {
      return res.status(400).json({ message: 'Auction cannot be deleted' });
    }

    await auction.remove();
    res.json({ message: 'Auction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};