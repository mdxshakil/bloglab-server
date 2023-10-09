import express from 'express';
import { ProfileController } from './profile.controller';
const router = express.Router();

router.patch(
  '/update-read-count/:profileId',
  ProfileController.updateBlogReadCount
);

router.get('/:profileId', ProfileController.getProfileInfo);

export const ProfileRoutes = router;
