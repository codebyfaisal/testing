import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { IS_SECURE } from "../../constants.js";
import { AuthService } from "./auth.service.js";

const checkAdminExists = asyncHandler(async (req, res) => {
    const hasAdmin = await AuthService.checkAdminExists();
    return res.status(200).json(
        new ApiResponse(200, { hasAdmin }, "Admin status checked successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) throw new ApiError(400, "email is required");
    if (!password) throw new ApiError(400, "password is required");

    const { user, accessToken, refreshToken } = await AuthService.loginUser(email, password);

    const options = {
        httpOnly: true,
        secure: IS_SECURE,
        sameSite: IS_SECURE ? "none" : "lax"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user,
                },
                "User logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await AuthService.logoutUser(req.user._id);

    const options = {
        httpOnly: true,
        secure: IS_SECURE,
        sameSite: IS_SECURE ? "none" : "lax"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword) throw new ApiError(400, "oldPassword is required");
    if (!newPassword) throw new ApiError(400, "newPassword is required");
    if (!confirmNewPassword) throw new ApiError(400, "confirmNewPassword is required");
    if (newPassword !== confirmNewPassword) throw new ApiError(400, "Passwords do not match");
    if (newPassword === oldPassword) throw new ApiError(400, "New password cannot be the same as the old password");

    await AuthService.changePassword(req.user._id, oldPassword, newPassword);

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is missing");
    }

    const { accessToken, refreshToken } = await AuthService.refreshAccessToken(incomingRefreshToken);

    const options = {
        httpOnly: true,
        secure: IS_SECURE,
        sameSite: IS_SECURE ? "none" : "lax"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {},
                "Access token refreshed successfully"
            )
        );
});

export { loginUser, logoutUser, checkAdminExists, changePassword, refreshAccessToken };

