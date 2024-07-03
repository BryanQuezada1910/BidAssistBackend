import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import { GenerateAccesToken } from "../services/jwtService.js";

dotenv.config({ path: '../../.env' });

const validateRefreshToken = async (access_token) => {
  const { id } = jwt.decode(access_token);

  const [user, admin] = await Promise.all([
    User.findById(id).select('refreshToken -_id').lean(),
    Admin.findById(id).select('refreshToken -_id').lean()
  ]);

  const account = user || admin;

  if (!account || !account.refreshToken) return;

  try {
    return jwt.verify(account.refreshToken, process.env.JWT_SECRET) || null;
  } catch (error) {
    console.error('Error verifying refresh token:', error);
  }
};

export const auth = async (req, res, next) => {

  const access_token = req.cookies.access_token;
  req.session = { user: null }

  try {
    const user = jwt.verify(access_token, process.env.JWT_SECRET);
    req.session.user = user;

  } catch (error) {
    if (error.name !== 'TokenExpiredError') {
      return next();
    }

    const user = await validateRefreshToken(access_token);
    if (!user) {
      return next();
    }
    if (user) {
      // const newAccessToken = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const newAccessToken = GenerateAccesToken(user);

      res.cookie('access_token', newAccessToken, {
        httpOnly: false,
        maxAge: 3600000,
        sameSite: 'none',
        secure: true
      });
    }
  };
  next();
};

export const validateUser = (validUsers) => {

  return async (req, res, next) => {
    const access_token = req.cookies.access_token;

    if (!access_token) return res.status(401).send({ message: "No credentials are provided" });


    let user = null;
    try {
      user = jwt.verify(access_token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name !== 'TokenExpiredError') return res.status(401).send({ message: "User not register" });

      user = await validateRefreshToken(access_token);
      if (!user) return res.status(401).send({ message: "User not register" });

      const newAccessToken = GenerateAccesToken(user);

      res.cookie('access_token', newAccessToken, {
        httpOnly: false,
        maxAge: 3600000,
        sameSite: 'none',
        secure: true
      });

    }

    if (!validUsers.includes(user.role) && !validUsers.includes(user.isSuscribed)) {
      return res.status(403).send({ message: "Access denied" });
    }

    req.session = user;
    next();
  };
}
