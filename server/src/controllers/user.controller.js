import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Config } from "../models/config.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUser = asyncHandler(async (req, res) =>
    res.status(200).json(new ApiResponse(
        200, req.user, "User fetched successfully"
    ))
)

const updateUser = asyncHandler(async (req, res) => {
    const {
        username,
        name,
        email,
        bio,
        phone,
        address,
        socialLinks,
        skills,
        experience,
        education,
        projectsCompleted,
        happyClients,
        yearOfExperience,
        avatar,
        resume,
        introVideo
    } = req.body

    if (!username)
        throw new ApiError(400, "Username is required")
    if (!name.first)
        throw new ApiError(400, "First name is required")
    if (!email)
        throw new ApiError(400, "Email is required")

    const { first, last } = name

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar,
                resume,
                introVideo,
                username,
                name: {
                    first,
                    last
                },
                email,
                bio,
                phone,
                address,
                socialLinks,
                skills,
                experience,
                education,
                stats: {
                    yearOfExperience,
                    projectsCompleted,
                    happyClients
                }
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const getPortfolioProfile = asyncHandler(async (req, res) => {
    const user = await User.findOne().select("-password -refreshToken");
    const config = await Config.findOne();
    if (!user) throw new ApiError(404, "User profile not found");

    return res.status(200).json(
        new ApiResponse(200, { user, config }, "Portfolio profile fetched successfully")
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required")
    }

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

export { getUser, updateUser, getPortfolioProfile, changeCurrentPassword }
