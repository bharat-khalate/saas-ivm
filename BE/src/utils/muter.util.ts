import multer from "multer";
import path from "path";

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, 'uploads/'); // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Rename file with timestamp and original extension
    }
});

const upload = multer({ storage: storage });

export default upload;