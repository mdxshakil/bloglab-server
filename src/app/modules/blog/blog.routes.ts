import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import upload from '../../middlewares/multer';
import { BlogController } from './blog.controller';
const router = express.Router();

router.post(
  '/create-new-blog',
  auth(ENUM_USER_ROLE.BLOGGER),
  upload.single('banner'),
  BlogController.createNewBlog
);

router.post('/like-blog', BlogController.likeBlog);

router.get('/get-pending-blogs', BlogController.getBlogsForAdminDashboard);
router.get('/get-preferred-blogs', BlogController.getBlogsByUserPreference);
router.get('/latest-blogs', BlogController.getLatestBlogs);
router.get('/featured-blogs', BlogController.getFeaturedBlogs);

router.patch(
  '/approve-pending-blogs',
  auth(ENUM_USER_ROLE.ADMIN),
  BlogController.approveBlogByAdmin
);

router.get('/:blogId', BlogController.getBlogById);
router.get('/author/:authorId', BlogController.getBlogsByAuthorId);

router.delete(
  '/:blogId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BLOGGER),
  BlogController.deleteBlogById
);

router.patch(
  '/featured-list/:blogId',
  auth(ENUM_USER_ROLE.ADMIN),
  BlogController.makeFeatured
);

export const BlogRoutes = router;
