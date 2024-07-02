import { sendTickets } from "../services/webHookService.js";
import { MailWrapper } from "../services/emailService.js";

export class WebHookController {
  static async getTickets(req, res) {


    const { updatedTickets } = req.body;
    if (!updatedTickets || !updatedTickets.length) return res.status(400).send({ message: "No tickets to update" });

    try {
      await sendTickets(updatedTickets);
      res.status(200).send('Webhook received');
    } catch (error) {
      console.error('Error handling webhook tickets:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  static async getAuctions(req, res) {

    const { endUpdateResult } = req.body;
    if (!endUpdateResult || !endUpdateResult.length) return res.status(400).send({ message: "No auctions to update" });


    try {

      await clearCache("Admin:auctions");
      endUpdateResult.forEach((auction) => {
        MailWrapper.sendAuctionWinnerReceiptEmail([auction.ownerUser.email], auction);
      });

      res.status(200).send('Webhook received');
    } catch (error) {
      console.error('Error handling webhook auctions:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}



