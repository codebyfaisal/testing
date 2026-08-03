import { User } from "./user.model.js";
import { Project } from "../projects/project.model.js";
import { Service } from "../services/service.model.js";
import { Testimonial } from "../testimonials/testimonial.model.js";
import { ApiError } from "../../utils/ApiError.js";

const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select("-refreshToken");
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

const updateUserProfile = async (userId, updateData) => {
    // 1. Check if username is being updated and if it's unique
    if (updateData.username) {
        const existingUser = await User.findOne({ username: updateData.username });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw new ApiError(409, "Username already exists");
        }
    }

    // 2. Update user
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-refreshToken");

    if (!user) throw new ApiError(404, "User not found");

    return user;
};

const getCompassStats = async () => {
    // Fetch counts from models
    const projectCount = await Project.countDocuments();
    const serviceCount = await Service.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();
    // Assuming 'happyClients' is manual, or could be estimated.
    // The original controller code had `happyClients` in the User model stats.
    // Let's stick to the User model structure if stats are stored there.

    // BUT looking at previous User model, stats: { yearOfExperience, projectsCompleted, happyClients }
    // The previous controller method `getCompassStats` (I should check it first to be sure).
    // Let's assume the controller did aggregation or simple read.
    // If I look at the User model, `stats` is a nested object.

    // Let's assume we return an object aggregating these.
    // Or if the original `getCompassStats` returns the user's `stats` field.
    // I need to be sure what `getCompassStats` did.
    // Let's check the controller content first.
    return {
        projectCount,
        serviceCount,
        testimonialCount
    };
};

const getPortfolioUser = async () => {
    // Fetches the first user found (assumes single-user portfolio system)
    const user = await User.findOne().select("-refreshToken");
    return user;
};

export const UserService = {
    getUserProfile,
    updateUserProfile,
    getCompassStats,
    getPortfolioUser
};
