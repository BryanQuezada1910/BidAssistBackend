import Auction from "../models/Auction.js";
import User from "../models/User.js";

export default (io) => {
  const activeAuctions = new Map();

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("bid", async (data) => {
      try {
        const { auctionId, amount, bidder, username } = data;

        if (!auctionId || !amount || !bidder) {
          throw new Error("Missing bid data");
        }

        const auction = await Auction.findById(auctionId).populate("currentBider");

        if (
          auction &&
          auction.endDate > new Date() &&
          amount > auction.currentBid &&
          amount >= auction.minimumBid &&
          auction.ownerUser.toString() !== bidder &&
          auction.status === "in progress"
        ) {
          auction.currentBid = amount + auction.currentBid;
          auction.currentBider = bidder;

          const newMessage = {
            amount,
            username: username,
          };

          auction.bidders.push(bidder);

          auction.chat.messages.push(newMessage);

          await auction.save();

          io.to(auctionId).emit("bidUpdate", {
            auction
          });

          io.to(auctionId).emit("chatMessage", {
            username: username,
            amount: amount,
            text: `Nueva oferta de ${username} por $${amount}`
          });

        } else {
          throw new Error("Invalid bid");
        }
      } catch (error) {
        console.error("Error handling bid:", error);
      }
    });

    socket.on("joinAuction", async (auctionId) => {
      try {
        const auction = await Auction.findById(auctionId).populate("currentBider");
        if (auction) {
          socket.join(auctionId);
          if (!activeAuctions.has(auctionId)) {
            activeAuctions.set(auctionId, new Set());
          }
          activeAuctions.get(auctionId).add(socket.id);

          socket.emit("auctionData", auction);
        } else {
          throw new Error("Auction not found");
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
