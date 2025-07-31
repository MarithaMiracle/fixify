const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(uploadsDir, req.uploadType || 'general');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});

// File filter for different types
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const documentFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only document files are allowed'));
    }
};

// Configure multer instances
const uploadImage = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    },
    fileFilter: imageFilter
});

const uploadDocument = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB for documents
    },
    fileFilter: documentFilter
});

// Middleware to set upload type
const setUploadType = (type) => (req, res, next) => {
    req.uploadType = type;
    next();
};

// Upload profile image
router.post('/profile-image',
    authenticateToken,
    setUploadType('profiles'),
    uploadImage.single('profileImage'),
    async(req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const imageUrl = `/uploads/profiles/${req.file.filename}`;

            // Update user profile image in database
            const { User } = require('../models');
            await User.update({ profileImage: imageUrl }, { where: { id: req.user.id } });

            res.json({
                success: true,
                message: 'Profile image uploaded successfully',
                data: {
                    imageUrl,
                    filename: req.file.filename
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to upload profile image',
                error: error.message
            });
        }
    }
);

// Upload service images
router.post('/service-images',
    authenticateToken,
    setUploadType('services'),
    uploadImage.array('serviceImages', 5), // Max 5 images
    (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files uploaded'
                });
            }

            const imageUrls = req.files.map(file => `/uploads/services/${file.filename}`);

            res.json({
                success: true,
                message: 'Service images uploaded successfully',
                data: {
                    imageUrls,
                    count: req.files.length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to upload service images',
                error: error.message
            });
        }
    }
);

// Upload portfolio images
router.post('/portfolio-images',
    authenticateToken,
    setUploadType('portfolio'),
    uploadImage.array('portfolioImages', 10), // Max 10 images
    (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files uploaded'
                });
            }

            const imageUrls = req.files.map(file => `/uploads/portfolio/${file.filename}`);

            res.json({
                success: true,
                message: 'Portfolio images uploaded successfully',
                data: {
                    imageUrls,
                    count: req.files.length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to upload portfolio images',
                error: error.message
            });
        }
    }
);

// Upload verification documents
router.post('/verification-documents',
    authenticateToken,
    setUploadType('verification'),
    uploadDocument.array('documents', 3), // Max 3 documents
    (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files uploaded'
                });
            }

            const documentUrls = req.files.map(file => ({
                url: `/uploads/verification/${file.filename}`,
                originalName: file.originalname,
                type: path.extname(file.originalname).toLowerCase()
            }));

            res.json({
                success: true,
                message: 'Verification documents uploaded successfully',
                data: {
                    documents: documentUrls,
                    count: req.files.length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to upload verification documents',
                error: error.message
            });
        }
    }
);

// Delete uploaded file
router.delete('/file/:filename', authenticateToken, (req, res) => {
    try {
        const { filename } = req.params;
        const { type = 'general' } = req.query;

        const filePath = path.join(uploadsDir, type, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'File deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files'
            });
        }
    }

    res.status(400).json({
        success: false,
        message: error.message || 'File upload error'
    });
});

module.exports = router;