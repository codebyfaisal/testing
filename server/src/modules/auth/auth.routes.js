import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { loginUser, logoutUser, checkAdminExists, changePassword, refreshAccessToken } from "./auth.controller.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/admin-exists").get(checkAdminExists);
router.route("/refresh").post(refreshAccessToken);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me/change-password").post(verifyJWT, changePassword);

export default router;
