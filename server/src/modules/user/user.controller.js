import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { UserService } from "./user.service.js";
import { ConfigService } from "./config.service.js";
import { AuthService } from "../auth/auth.service.js";

const getUser = asyncHandler(async (req, res) => {
    const user = await UserService.getUserProfile(req.user._id);
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

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
    } = req.body;

    if (!username) throw new ApiError(400, "Username is required");
    if (!name?.first) throw new ApiError(400, "First name is required");
    if (!email) throw new ApiError(400, "Email is required");

    const updateData = {
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
        stats: {
            yearOfExperience,
            projectsCompleted,
            happyClients
        },
        avatar,
        resume,
        introVideo
    };

    const user = await UserService.updateUserProfile(req.user._id, updateData);

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

const getPortfolioProfile = asyncHandler(async (req, res) => {
    // This seems to fetch the single "admin" user for the portfolio, or the first one.
    // The previous implementation used User.findOne() which fetches the first user.
    // We'll mimic this behavior or ask if we should fetch by specific criteria.
    // For now, let's assume there's a main user. Since I don't have the ID, I'll need a service method for "getMainUser".
    // But `UserService.getUserProfile` requires ID.
    // Let's check `UserService.js` again. I only added `getUserProfile(id)`.
    // I should add `getPublicProfile()` to `UserService`.

    // Wait, let's look at `User.findOne()` in the original code.
    // It implies there's only one user or we just take the first.
    // I will use a new service method `UserService.getPublicProfile()`.

    // For now, since I can't edit UserService in this step, I will use `User` model here? 
    // No, I strictly want to remove Model usage.
    // I will edit `UserService` in the next step to add `getPublicProfile`.
    // Actually, I can fix `UserService` first or just assume it exists and fix it immediately after.
    // I already wrote `UserService` in the previous turn. I cannot edit it in the SAME turn if I want to use it here comfortably.
    // Oops, I can edit multiple files.
    // I will update `UserService` to include `getPublicProfile` first (or validation step).
    // Actually `User.findOne()` is usually bad practice if multiple users exist, but for a portfolio it's likely single user.
    // I'll update `UserService` to include `getFirstUser`.

    // Changing plan: I will update `user.service.js` using `replace_file_content` to add `getPortfolioUser` method.
    const user = await UserService.getPortfolioUser();
    const config = await ConfigService.getConfig();

    if (!user) throw new ApiError(404, "User profile not found");

    return res.status(200).json(
        new ApiResponse(200, { user, config }, "Portfolio profile fetched successfully")
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    await AuthService.changePassword(req.user._id, oldPassword, newPassword);

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

export { getUser, updateUser, getPortfolioProfile, changeCurrentPassword };

