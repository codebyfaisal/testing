import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getMedia, deleteMedia, uploadMedia } from "../controllers/media.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .get(getMedia)
    .post(upload.single("file"), uploadMedia);

router.route("/:publicId").delete(deleteMedia);

export default router;
