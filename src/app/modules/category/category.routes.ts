import express from 'express';
import { CategoryController } from './category.controller';
const router = express.Router();

router.get(
  '/get-user-selected-category',
  CategoryController.getUsersSelectedcategory
);
router.post('/create-category', CategoryController.createCategory);
router.get('/', CategoryController.getAllCategory);
router.get('/:id', CategoryController.getSingleCategory);
router.patch(
  '/follow-unfollow-category',
  CategoryController.followUnfollowCategory
);

export const CategoryRoutes = router;
