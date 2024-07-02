import User from '../models/User.js';
import { MailWrapper } from './emailService.js';
import { formatDate } from '../utils/dateUtils.js';
import { clearCache } from './redisService.js';

export const sendTickets = async (updatedTickets) => {
  try {
    await clearCache("Admin:tickets");
    const ticketPromises = updatedTickets.map(async (ticket) => {

      await clearCache(`${ticket.createdBy}:tickets`);
      const user = await User.findById(ticket.createdBy).lean();
      if (!user) {
        throw new Error(`User not found for ID: ${ticket.createdBy}`);
      }
      return {
        ...ticket,
        createdAt: formatDate(ticket.createdAt),
        createdBy: user.username
      };
    });

    const updatedTicketsWithUsers = await Promise.all(ticketPromises);

    MailWrapper.sendHighPriorityNotificationEmail(["pachecco415@gmail.com"], updatedTicketsWithUsers, "https://m.media-amazon.com/images/I/611ZHr9pdWL._AC_UF1000,1000_QL80_.jpg");
  } catch (error) {
    console.error("Error processing tickets or sending emails:", error);
  }
};