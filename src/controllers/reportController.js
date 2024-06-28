import { ReportWrapper } from "../services/reportService.js";


/**
 * Controller class for managing reports.
 */
export class ReportController {

  /**
   * Handler for generating and serving reports based on 'type' parameter.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} - JSON response with report data or error message.
   */
  static async getReport(req, res) {
    try {
      const { type } = req.query;

      // Validate 'type' parameter
      if (!type || (type !== "financial" && type !== "auctions")) {
        return res.status(400).send({ message: "Invalid or missing 'type' parameter" });
      }

      let PDF = {};

      // Generate report based on 'type'
      if (type === "financial") {
        PDF = await ReportWrapper.generateFinancialReport();
      } else if (type === "auctions") {
        PDF = await ReportWrapper.generateAuctionsReport();
      }

      // Ensure a valid PDF object was generated
      if (!PDF || !PDF.buffer || !PDF.filename) {
        return res.status(500).send({ message: "Failed to generate PDF report" });
      }

      // Set headers for PDF response
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment;filename=${PDF.filename}`,
        'Content-Length': PDF.buffer.length
      });

      // Send PDF buffer as response
      res.send(PDF.buffer);

    } catch (error) {
      console.error('Error in getReport:', error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}
