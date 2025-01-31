const multer = require('multer');
const path = require('path');

// Set up storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.pdf', '.docx'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  },
});

module.exports = upload;