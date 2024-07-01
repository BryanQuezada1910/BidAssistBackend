import { launch } from "puppeteer";
import path from "node:path";

import Auction from "../models/Auction.js";
import { formatDate } from "../utils/dateUtils.js";
import { loadTemplate } from "../utils/templateUtils.js";

const __dirname = import.meta.dirname;

export class ReportWrapper {


  static async generatePDF(htmlContent, name) {
    const browser = await launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const buffer = await page.pdf({ format: 'A4', landscape: true, printBackground: true });
    await browser.close();

    const timespan = new Date().toISOString().replace(/:/g, '-');
    const filename = `${name}-report-${timespan}.pdf`;

    return {
      filename,
      buffer
    }
  }

  static async getAuctionsByStatus(status) {
    return await Auction.find({ status }).lean();
  }

  static async generateAuctionsReport() {
    try {
      // Obtener subastas por estado
      const scheduledAuctions = await this.getAuctionsByStatus('active');
      const activeAuctions = await this.getAuctionsByStatus('in progress');
      const closedAuctions = await this.getAuctionsByStatus('finished');

      const data = {
        activeAuctions: activeAuctions.map(auction => ({
          title: auction.title,
          description: auction.description,
          category: auction.category,
          startDate: formatDate(auction.startDate),
          productName: auction.product.name,
          initialPrice: auction.initialPrice,
          bidders: auction.bidders.length
        })),
        scheduledAuctions: scheduledAuctions.map(auction => ({
          title: auction.title,
          description: auction.description,
          category: auction.category,
          startDate: formatDate(auction.startDate),
          productName: auction.product.name,
          initialPrice: auction.initialPrice,
          minimumBid: auction.minimumBid,
        })),
        closedAuctions: closedAuctions.map(auction => ({
          title: auction.title,
          description: auction.description,
          category: auction.category,
          productName: auction.product.name,
          initialPrice: auction.initialPrice,
          currentBid: auction.currentBid,
          bidders: auction.bidders.length,
          startDate: formatDate(auction.startDate),
          endDate: formatDate(auction.endDate)
        }))
      };

      const templatePath = path.join(__dirname, "../templates/reports/auctions-report.html");
      const htmlContent = loadTemplate(templatePath, data);

      return this.generatePDF(htmlContent, "auctions");

    } catch (error) {
      console.error('Error al generar el reporte', error);
    }
  }

  static async generateFinancialReport() {
    try {
      const closedAuctions = await this.getAuctionsByStatus('finished');

      const data = {
        closedAuctions: closedAuctions.map(auction => ({
          title: auction.title,
          description: auction.description,
          productName: auction.product.name,
          category: auction.category,
          initialPrice: auction.initialPrice,
          minimumBid: auction.minimunBid,
          currentBid: auction.currentBid,
          endDate: formatDate(auction.endDate)
        })),
        totalRevenue: closedAuctions.reduce((total, auction) => {
          return total + (auction.currentBid || 0);
        }, 0)
      };

      const templatePath = path.join(__dirname, "../templates/reports/financial-report.html");
      const htmlContent = loadTemplate(templatePath, data);

      return this.generatePDF(htmlContent, "financial");

    } catch (error) {
      console.error('Error al generar el reporte', error);
    }
  }
}
