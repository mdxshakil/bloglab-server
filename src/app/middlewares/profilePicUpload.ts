import httpStatus from 'http-status';
import multer from 'multer';
import path from 'path';
import config from '../../config';
import ApiError from '../../errors/ApiError';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.profile_pic_dest as string);
  },
  filename: (req, file, callback) => {
    const fileExt = path.extname(file.originalname);
    const fileName = 'User-profile-picture' + '-' + Date.now();
    callback(null, fileName + fileExt);
  },
});

const UploadAvatar = multer({
  storage,
  limits: {
    fileSize: 1000000, //1mb
  },
  fileFilter(req, file, callback) {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      callback(null, true);
    } else {
      callback(new ApiError(httpStatus.BAD_REQUEST, 'Invalid file type'));
    }
  },
});

export default UploadAvatar;
