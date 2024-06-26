import { sendTickets } from "../services/webhook.js";

export class WebHookController {
  static async getTickets(req, res) {


    const { updatedTickets } = req.body;
    console.log('Tickets recibidos: ', updatedTickets);
    if (!updatedTickets || !updatedTickets.length) {
      return res.status(400).send({ message: "No tickets to update" });
    }

    try {
      await sendTickets(updatedTickets);
      res.status(200).send('Webhook received');
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}



