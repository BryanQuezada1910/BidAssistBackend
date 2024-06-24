import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({ path: '../../.env' });

const auth = (req, res, next) => {
    const access_token = req.cookies.access_token;
    req.session = { user: null };

    try {
        const user = jwt.verify(access_token, process.env.JWT_SECRET);
        req.session.user = user;
    } catch { };

    next();

};

export { auth };