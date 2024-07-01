import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { writeCache, readCache } from "../services/redisService.js";
import Admin from "../models/Admin.js";
import { GenerateAccesToken } from "../services/JWTService.js";

dotenv.config({ path: '../../.env' });

const validateRefreshToken = async (access_token) => {
    const { username } = jwt.decode(access_token);
    const tokenFromDb = await User.findOne({ username }) || await Admin.findOne({ username });
    console.log("user:validaterefreshtoken  ", tokenFromDb);

    // const tokenFromDb = await User.findOne({ username }).select('refreshToken -_id');

    if (!tokenFromDb) {
        return null;
    }

    console.log("\nvalidando refresh token: ", tokenFromDb.refreshToken);
    try {
        const user = jwt.verify(tokenFromDb.refreshToken, process.env.JWT_SECRET);
        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        return false;
    }

};

const auth = async (req, res, next) => {

    const access_token = req.cookies.access_token;

    try {
        const user = jwt.verify(access_token, process.env.JWT_SECRET);
        req.session = user;

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
                httpOnly: true,
                maxAge: 3600000
            });

            await writeCache(user.id, user, {
                EX: 3600, // 1 horas
            })


        }
    };

    next();
};

const validateUser = async (req, res, next) => {

    console.log("\nvalidate user\n");
    const access_token = req.cookies.access_token;
    console.log(access_token);
    try {
        const user = jwt.verify(access_token, process.env.JWT_SECRET);
        console.log("\nusuario verificado\n", user);
        req.session = user;
    } catch (error) {
        if (error.name !== 'TokenExpiredError') {
            return res.status(401).send({ message: "User not register 1" });
        }

        const user = await validateRefreshToken(access_token);
        if (!user) {
            return res.status(401).send({ message: "User not register 2" });
        }
        if (user) {
            // const newAccessToken = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const newAccessToken = GenerateAccesToken(user);

            res.cookie('access_token', newAccessToken, {
                httpOnly: true,
                maxAge: 3600000
            });

            req.session = user;
        }
    };

    next();
};

export { auth, validateUser };