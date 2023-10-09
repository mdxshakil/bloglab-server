import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { CategoryController } from './category.controller';
const router = express.Router();

router.get(
  '/get-user-selected-category',
  CategoryController.getUsersSelectedcategory
);

router.patch(
  '/edit-category/:categoryId',
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.editCategory
);

router.post(
  '/create-category',
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.createCategory
);

router.get('/', CategoryController.getAllCategory);

router.get('/:id', CategoryController.getSingleCategory);

router.patch(
  '/follow-unfollow-category',
  CategoryController.followUnfollowCategory
);

export const CategoryRoutes = router;
