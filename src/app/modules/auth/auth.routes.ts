import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import upload from '../../middlewares/multer';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  upload.single('profilePicture'),
  AuthController.signUp
);

router.post(
  '/login',
  validateRequest(AuthValidation.login),
  AuthController.login
);

router.get(
  '/persist-login',
  auth(ENUM_USER_ROLE.BLOGGER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.READER),
  AuthController.persistLogin
);

router.patch(
  '/approve-unapprove-user/:userId',
  auth(ENUM_USER_ROLE.ADMIN),
  AuthController.approveUnApproveUser
);

export const AuthRoutes = router;
