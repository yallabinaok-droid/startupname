import multer from "multer";

export const fileValidationTypes = {
    image: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/json'],
    video: [
        'video/mp4',
        'video/quicktime',     // .mov
        'video/x-msvideo',     // .avi
        'video/webm',
        'video/mpeg'
    ]
};

export const uploadCloudFile = (fileValidation = []) => {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`❌ الملف غير مدعوم! نوع الملف: ${file.mimetype}`), false);
        }
    }

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 100 * 1024 * 1024   // حد أقصى 100 ميجا للفيديو
        }
    });
};