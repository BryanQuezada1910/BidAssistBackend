// admin:tickets -> todas los tickets de todos los usuarios
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




// admin:auctions -> todas las subastas de todos los usuarios
// not-suscribed:auctions -> todas las subastas activas de todos los usuarios suscritos
export const generateAuctionsKey = (req) => {
  // Asegurarse de que req.session existe
  if (!req.session) {
    throw new Error("Session information is missing");
  }

  // Desestructurar propiedades del objeto de sesión del usuario
  const { role } = req.session;

  // Determinar la parte del usuario de la clave
  const userPart = role || "not-suscribed";

  // Devolver la clave generada
  return `${userPart}:auctions`;
}


