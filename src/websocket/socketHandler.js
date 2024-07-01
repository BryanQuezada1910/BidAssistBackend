import Auction from "../models/Auction.js";

export default (io) => {
  const activeAuctions = new Map();

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("bid", async (data) => {
      try {
        const auction = await Auction.findById(data.auctionId).populate("currentBider");

        if (
           auction &&
           auction.endDate > new Date() &&
           data.amount > auction.currentBid &&
           data.amount >= auction.minimumBid &&
           auction.ownerUser !== data.bidder &&
           auction.status === "active"
        ) {
          auction.currentBid = data.amount + auction.currentBid;
          auction.currentBider = data.bidder;

          const newMessage = {
            amount: data.amount,
            username: data.bidder,
          };

          auction.chat.messages.push(newMessage);

          await auction.save();

          io.to(data.auctionId).emit("bidUpdate", {
            auctionId: auction._id,
            currentBid: auction.currentBid,
            currentBider: auction.currentBider.username,
          });

          io.to(data.auctionId).emit("chatMessage", {
            message: `Nueva oferta de ${data.bidder}: $${data.amount}`
          });
        }
      } catch (error) {
        console.error("Error handling bid:", error);
      }
    });

    socket.on("joinAuction", async (auctionId) => {
      try {
        const auction = await Auction.findById(auctionId);
        if (auction) {
          socket.join(auctionId);
          if (!activeAuctions.has(auctionId)) {
            activeAuctions.set(auctionId, new Set());
          }
          activeAuctions.get(auctionId).add(socket.id);

          socket.emit("auctionData", auction);
        }
      } catch (error) {
        console.error("Error joining auction:", error);
      }
    });

    socket.on("leaveAuction", (auctionId) => {
      socket.leave(auctionId);
      if (activeAuctions.has(auctionId)) {
        activeAuctions.get(auctionId).delete(socket.id);
        if (activeAuctions.get(auctionId).size === 0) {
          activeAuctions.delete(auctionId);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      activeAuctions.forEach((sockets, auctionId) => {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            activeAuctions.delete(auctionId);
          }
          console.log(`Client ${socket.id} disconnected from auction ${auctionId}`);
        }
      });
    });
  });
};
