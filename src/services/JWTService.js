import jwt from 'jsonwebtoken';

const GenerateAccesToken = (user) =>
    jwt.sign({ id: user._id, name: user.name, lastname: user.lastname, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

const GenerateRefreshToken = (user) =>
    jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

export { GenerateAccesToken, GenerateRefreshToken };