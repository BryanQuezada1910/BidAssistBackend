import jwt from 'jsonwebtoken';

export const GenerateAccesToken = (user) =>
  jwt.sign({ id: user._id, isSuscribed: user.isSuscribed, role: user.role, name: user.name, lastname: user.lastname, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

export const GenerateRefreshToken = (user) =>
  jwt.sign({ id: user._id, isSuscribed: user.isSuscribed, role: user.role, name: user.name, lastname: user.lastname, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

