import { Router } from "express";
import { getOverviewStats } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Protect all dashboard routes

router.route("/stats").get(getOverviewStats);

export default router;
