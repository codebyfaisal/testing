import { User } from "../user/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiError } from "../../utils/ApiError.js";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, ADMIN_EMAIL, ADMIN_PASSWORD } from "../../constants.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = jwt.sign(
            {
                _id: user._id
            },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_EXPIRY
            }
        );
        const refreshToken = jwt.sign(
            {
                _id: user._id
            },
            REFRESH_TOKEN_SECRET,
            {
                expiresIn: REFRESH_TOKEN_EXPIRY
            }
        );

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Failed to generate access and refresh tokens");
    }
};

const checkAdminExists = async () => {
    const count = await User.countDocuments();
    return count > 0;
};

import { UserService } from "../user/user.service.js";

const loginUser = async (password) => {
    const targetPassword = ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "admin123";

    const isMatch = targetPassword.startsWith("$2a$") || targetPassword.startsWith("$2b$")
        ? bcrypt.compareSync(password, targetPassword)
        : password === targetPassword;

    if (!isMatch) {
        throw new ApiError(401, "Invalid password");
    }

    const user = await UserService.getPortfolioUser();

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-refreshToken");

    return { user: loggedInUser, accessToken, refreshToken };
};

const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );
};

const changePassword = async (userId, oldPassword, newPassword) => {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (oldPassword !== adminPassword) {
        throw new ApiError(401, "Invalid old password");
    }

    process.env.ADMIN_PASSWORD = newPassword;
};

const refreshAccessToken = async (incomingRefreshToken) => {
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user || user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);
        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
};

export const AuthService = {
    checkAdminExists,
    loginUser,
    logoutUser,
    changePassword,
    refreshAccessToken,
};
