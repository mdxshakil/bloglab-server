import express from 'express';
import { StatisticsController } from './statistics.controller';

const router = express.Router();

router.get('/users', StatisticsController.getAllUsers);
router.get('/', StatisticsController.getStatisticsData);

router.patch('/add-or-remove-admin', StatisticsController.addOrRemoveAdmin);

router.get('/blogs-per-category', StatisticsController.blogsPerCategory);

export const StatisticsRoutes = router;
