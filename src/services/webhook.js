import User from '../models/User.js';
import { MailWrapper } from './emails.js';


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const sendTickets = async (updatedTickets) => {
  try {
    const ticketPromises = updatedTickets.map(async (ticket) => {
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
    console.log("Notification emails sent successfully");
  } catch (error) {
    console.error("Error processing tickets or sending emails:", error);
  }
};