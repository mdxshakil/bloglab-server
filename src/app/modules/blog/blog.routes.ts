import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import UploadBanner from '../../middlewares/blogBannerUpload';
import { BlogController } from './blog.controller';
const router = express.Router();

router.post(
  '/create-new-blog',
  auth(ENUM_USER_ROLE.BLOGGER),
  UploadBanner.single('banner'),
  BlogController.createNewBlog
);

export const BlogRoutes = router;
