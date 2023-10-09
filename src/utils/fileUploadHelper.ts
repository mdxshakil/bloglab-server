import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import cloudinary from './cloudinary';

export const uploadImage = async (path: string) => {
  return new Promise<string>((resolve, reject) => {
    cloudinary.v2.uploader.upload(path, (err, result) => {
      if (err) {
        reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to upload image'
          )
        );
      } else {
        resolve(result?.url as string);
      }
    });
  });
};
