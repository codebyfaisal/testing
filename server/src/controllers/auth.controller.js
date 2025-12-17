import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, IS_PRODUCTION } from "../constants.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                name: user.name.first + " " + user.name.last,
            },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_EXPIRY
            }
        )
        const refreshToken = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                name: user.name.first + " " + user.name.last,
            },
            REFRESH_TOKEN_SECRET,
            {
                expiresIn: REFRESH_TOKEN_EXPIRY
            }
        )

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Failed to generate access and refresh tokens")
    }
}

const checkAdminExists = asyncHandler(async (req, res) => {
    const count = await User.countDocuments();
    return res.status(200).json(
        new ApiResponse(200, { hasAdmin: count > 0 }, "Admin status checked successfully")
    );
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, username } = req.body;

    if ([email, password, username].some((field) => field?.trim() === ""))
        throw new ApiError(400, "All fields are required");

    if (!name.first) throw new ApiError(400, "First name is required");

    const existedUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existedUser)
        throw new ApiError(409, "A user with this email or username already exists");

    const user = await User.create({
        name,
        username,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser)
        throw new ApiError(500, "User registration failed. Please try again.");

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) throw new ApiError(400, "email is required");
    if (!password) throw new ApiError(400, "password is required");

    const user = await User.findOne({ email });

    if (!user) throw new ApiError(404, "User does not exist");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: IS_PRODUCTION ? "none" : "lax"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: IS_PRODUCTION ? "none" : "lax"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword) throw new ApiError(400, "oldPassword is required");
    if (!newPassword) throw new ApiError(400, "newPassword is required");
    if (!confirmNewPassword) throw new ApiError(400, "confirmNewPassword is required");
    if (newPassword !== confirmNewPassword) throw new ApiError(400, "Passwords do not match");
    if (newPassword === oldPassword) throw new ApiError(400, "New password cannot be the same as the old password");

    const user = await User.findById(req.user._id);

    if (!user) throw new ApiError(404, "User not found");

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

    user.password = newPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
})

export { registerUser, loginUser, logoutUser, checkAdminExists, changePassword }