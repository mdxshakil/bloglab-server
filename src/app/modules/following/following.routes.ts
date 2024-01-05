import express from 'express';
import { FollowingController } from './following.controller';
const router = express.Router();

router.post('/follow-blogger', FollowingController.followBlogger);

router.get('/check-follow-status', FollowingController.isAlreadyFollowing);

export const FollowingRoutes = router;
