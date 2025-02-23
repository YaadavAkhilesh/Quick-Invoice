const multer = require('multer');
const path = require('path');

// Configure multer for storing profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/profiles'));
    },
    filename: (req, file, cb) => {
        // Use vendor ID as filename to overwrite old profile picture
        const vendorId = req.user.id;
        const fileExt = path.extname(file.originalname);
        cb(null, `${vendorId}${fileExt}`);
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload; 