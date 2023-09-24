import express from 'express';
import { CategoryController } from './category.controller';
const router = express.Router();

router.post('/create-category', CategoryController.createCategory);
router.get('/', CategoryController.getAllCategory);
router.get('/:id', CategoryController.getSingleCategory);

export const CategoryRoutes = router;
