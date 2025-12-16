import { Router } from "express";
import {
    createProject,
    deleteProject,
    getAllProjects,
    getProjectById,
    updateProject
} from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllProjects).post(upload.single("image"), createProject);
router.route("/:id").get(getProjectById).patch(upload.single("image"), updateProject).delete(deleteProject);

export default router;
