import { Router } from "express";
import {
    createMessage,
    deleteMessage,
    getAllMessages,
    getMessageById,
    markMessageAsRead
} from "../controllers/message.controller.js";

const router = Router();

router.route("/").get(getAllMessages).post(createMessage);
router.route("/:id").get(getMessageById).delete(deleteMessage);
router.route("/:id/read").patch(markMessageAsRead);

export default router;
