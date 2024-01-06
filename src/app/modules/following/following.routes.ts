import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { FollowingController } from './following.controller';
const router = express.Router();

router.post(
  '/follow-blogger',
  auth(ENUM_USER_ROLE.READER, ENUM_USER_ROLE.BLOGGER),
  FollowingController.followBlogger
);

router.get(
  '/check-follow-status',
  auth(ENUM_USER_ROLE.READER, ENUM_USER_ROLE.BLOGGER),
  FollowingController.isAlreadyFollowing
);

export const FollowingRoutes = router;
