import Auction from "../models/Auction.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("bid", async (data) => {
      const auction = await Auction.findById(data.auctionId);

      if (
        auction &&
        auction.endDate > new Date() &&
        data.amount > auction.currentBid &&
        data.amount >= auction.minimunBid &&
        auction.ownerUser != data.bidder &&
        auction.status === "in progress"
      ) {
        auction.currentBid = data.amount;
        auction.currentBider = data.bidder;

        const newMessage = {
          amount: data.amount,
          username: data.bidder,
        };

        auction.chat.messages.push(newMessage);

        await auction.save();

        io.emit("bidUpdate", {
          auctionId: auction._id,
          currentBid: auction.currentBid,
          currentBider: auction.currentBider,
        });

        io.emit("chatMessage", {
          auctionId: auction._id,
          message: newMessage,
        });
      }
    });

    socket.on("joinAuction", async (auctionId) => {
      const auction = await Auction.findById(auctionId);
      if (auction) {
        socket.emit("auctionData", auction);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
