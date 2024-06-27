import { AuctionReport } from "../services/reportService.js";

const getAuctionReport = async (req, res) => {
  const response = AuctionReport.generateAllAuctionsReport();
  res.status(200).send(response);
};

export { getAuctionReport };
