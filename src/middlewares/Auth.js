import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: '../../.env' });

const validateRefreshToken = async (access_token) => {
    const { username } = jwt.decode(access_token);
    const tokenFromDb = await User.findOne({ username }).select('refreshToken -_id');

    if (!tokenFromDb) {
        return null;
    }

    const user = jwt.verify(tokenFromDb.refreshToken, process.env.JWT_SECRET);
    if (!user) {
        return null;
    }

    return user;

};

const auth = async (req, res, next) => {
    const access_token = req.cookies.access_token;
    req.session = { user: null };

    try {
        const user = jwt.verify(access_token, process.env.JWT_SECRET);
        req.session.user = user;
    } catch (error) {
        console.error(error.name);
        if (error.name !== 'TokenExpiredError') {
            req.session.user = null;
            return next();
        }

        const user = await validateRefreshToken(access_token);
        if (user) {
            console.log("Generando nuevo access token");
            const newAccessToken = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1m' });
            res.cookie('access_token', newAccessToken, {
                httpOnly: true,
                maxAge: 3600000
            });

            req.session.user = user;
        }
    };

    next();
};

export { auth };