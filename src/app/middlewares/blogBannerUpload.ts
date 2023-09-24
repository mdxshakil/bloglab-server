import { ACCOUNT_STATUS } from '@prisma/client';
import httpStatus from 'http-status';
import multer from 'multer';
import path from 'path';
import config from '../../config';
import ApiError from '../../errors/ApiError';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.blog_banner_dest as string);
  },
  filename: (req, file, callback) => {
    const fileExt = path.extname(file.originalname);
    const fileName = 'Blog-banner' + '-' + Date.now();
    callback(null, fileName + fileExt);
  },
});

const UploadBanner = multer({
  storage,
  limits: {
    fileSize: 2000000, //2mb
  },
  fileFilter(req, file, callback) {
    if (req.user?.accountStatus !== ACCOUNT_STATUS.active) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You account is not active');
    }
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

export default UploadBanner;
