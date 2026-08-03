import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const DANGEROUS_EXTENSIONS = [
    "exe", "bat", "cmd", "sh", "php", "js", "py", "dll", "msi", "vbs", "ps1", "jar", "asp", "aspx"
];

const fileFilter = (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (DANGEROUS_EXTENSIONS.includes(ext)) {
        return cb(new ApiError(400, `Files with extension .${ext} are not allowed for upload`), false);
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB Limit
    },
    fileFilter,
});
