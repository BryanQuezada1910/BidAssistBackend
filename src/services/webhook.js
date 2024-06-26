
export const sendTickets = async (updatedTickets) => {
  console.log('Tickets updated:');
  for (const ticket of updatedTickets) {
    console.log(ticket);
  }

};
