import Auction from "../models/Auction.js";

// Path: src/websocket/socketHandler.js
// Function to handle socket connections
export default (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("bid", async (data) => {
      const auction = await Auction.findById(data.auctionId);

      if (
        auction &&
        auction.endDate > new Date() &&
        data.amount > auction.currentBid
      ) {
        auction.currentBid = data.amount;
        auction.currentBider = data.bidder;

        auction.chat.messages.push({
          message: `New bid of $${data.amount} by ${data.bidder}`,
          sender: data.bidder,
        });

        await auction.save();

        io.emit("bidUpdate", {
          auctionId: auction._id,
          currentBid: auction.currentBid,
          currentBider: auction.currentBider,
        });
      }
    });

    socket.on("chatMessage", async (data) => {
      const auction = await Auction.findById(data.auctionId);

      if (auction) {
        auction.chat.messages.push({
          message: data.message,
          sender: data.sender,
        });

        await auction.save();

        io.emit("chatMessage", {
          auctionId: auction._id,
          message: data.message,
          sender: data.sender,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
