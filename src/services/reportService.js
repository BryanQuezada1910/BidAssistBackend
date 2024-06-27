import mustache from "mustache";
import fs from "node:fs";
import path from "node:path";
import Auction from "../models/Auction.js";

export class AuctionReport {
  static loadTemplate(templatePath, variables = {}) {
    let template = fs.readFileSync(templatePath, "utf8");
    return mustache.render(template, variables);
  }

  static async generateAllAuctionsReport() {
    try {
      const auctions = await Auction.find({});
      const templatePath = path.join(
        __dirname,
        "../templates/reports/auction-report.html"
      );
      const htmlContent = this.loadTemplate(templatePath, { auctions });
      return htmlContent;
    } catch {}
  }

  static generateFinishedAuctionsReport() {}
}
