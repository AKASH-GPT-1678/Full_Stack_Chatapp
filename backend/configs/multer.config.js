import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathname = path.join(__dirname, "uploads/");

if (!fs.existsSync(pathname)) {
    fs.mkdirSync(pathname, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathname);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const Upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

const bucketName = "mangementbkt";
export {
    Upload,
    pathname,
    bucketName
};