import User from "../models/User.js"
import { GenerateRefreshToken } from "./jwtService.js";

function addUser(user) {
    const newUser = new User({ name: user.name, lastname: user.lastname, username: user.username, email: user.email, password: user.password, isSuscribed: false });
    newUser.save()
        .then((savedUser) => {
            const refresh_token = GenerateRefreshToken(savedUser);

            User.findOneAndUpdate(
                { _id: savedUser._id },
                { refreshToken: refresh_token },
                { new: true }
            );
        });

    return newUser;
};

export { addUser };