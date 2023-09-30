import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { BlogRoutes } from '../modules/blog/blog.routes';
import { BookMarkRoutes } from '../modules/bookMark/bookMark.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { CommentRoutes } from '../modules/comment/comment.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/blog',
    route: BlogRoutes,
  },
  {
    path: '/bookMark',
    route: BookMarkRoutes,
  },
  {
    path: '/comment',
    route: CommentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
