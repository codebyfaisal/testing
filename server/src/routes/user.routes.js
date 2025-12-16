import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser, logoutUser, checkAdminExists, changePassword } from "../controllers/auth.controller.js";
import {
    getPortfolioProfile,
    getUser,
    updateUser,
} from "../controllers/user.controller.js";
import { getConfig, updateConfig } from "../controllers/config.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/admin-exists").get(checkAdminExists);
router.route("/portfolio").get(getPortfolioProfile);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/me").get(verifyJWT, getUser).patch(verifyJWT, updateUser);

router.route("/me/change-password").post(verifyJWT, changePassword);
router.route("/me/config").get(verifyJWT, getConfig).post(verifyJWT, updateConfig)

export default router;
