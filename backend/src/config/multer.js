const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Use memory storage for processing
const storage = multer.memoryStorage();

// File filter to only allow specific image types
const fileFilter = (req, file, cb) => {
    // Check MIME type
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
        return cb(new Error('Only JPG, JPEG and PNG files are allowed'), false);
    }

    // Check file extension
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(fileExt)) {
        return cb(new Error('Only JPG, JPEG and PNG files are allowed'), false);
    }

    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Process and save image function
const processAndSaveImage = async (buffer, vendorId, originalExt) => {
    const uploadDir = path.join(__dirname, '../../uploads/profiles');
    fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `${vendorId}${originalExt}`;
    const filepath = path.join(uploadDir, filename);

    // Process image: resize if too large, strip EXIF, convert to JPEG for consistency
    await sharp(buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }) // Max 1024x1024
        .jpeg({ quality: 85 }) // Convert to JPEG, strip metadata
        .toFile(filepath);

    return filename;
};

module.exports = { upload, processAndSaveImage };
