// Admin:tickets -> todas los tickets de todos los usuarios
// ID:tickets -> todas los tickets activas del usuario
export const generateTicketsKey = (req) => {

  // Asegurarse de que req.session existe
  if (!req.session) {
    throw new Error("Session information is missing");
  }

  const user = req.session;

  // Devolver la clave generada
  return `${user.role || user.id}:${"tickets"}`
}




// Admin:auctions -> todas las subastas de todos los usuarios
export const generateAuctionsKey = (req) => {
  // Asegurarse de que req.session existe
  if (!req.session) {
    throw new Error("Session information is missing");
  }

  const user = req.session;

  // Devolver la clave generada
  return `${user.role}:auctions`;
}


