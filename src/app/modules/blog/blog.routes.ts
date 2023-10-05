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

router.post('/like-blog', BlogController.likeBlog);

router.get('/get-pending-blogs', BlogController.getBlogsForAdminDashboard);
router.get('/get-preferred-blogs', BlogController.getBlogsByUserPreference);
router.get('/latest-blogs', BlogController.getLatestBlogs);
router.get('/featured-blogs', BlogController.getFeaturedBlogs);

router.patch('/approve-pending-blogs', BlogController.approveBlogByAdmin);

router.get('/:blogId', BlogController.getBlogById);
router.get('/author/:authorId', BlogController.getBlogsByAuthorId);

router.delete('/:blogId', BlogController.deleteBlogById);

export const BlogRoutes = router;
