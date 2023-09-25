import { ACCOUNT_STATUS, USER_ROLE } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { ITransactionClient } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { ILoginResponse, ILoginUser, ISingupUser } from './auth.interface';
import { checkUserExistencyWithEmail, comparePassword } from './auth.utils';

const signUp = async (payload: ISingupUser): Promise<{ message: string }> => {
  const {
    email,
    password,
    role,
    firstName,
    lastName,
    profilePicture,
    contactNo,
    favouriteCategories,
  } = payload;

  const hashedPassword = await bcrypt.hash(
    password,
    config.bycrypt_salt_rounds
  );

  await prisma.$transaction(async (tc: ITransactionClient): Promise<void> => {
    //create the user
    const userCreateResult = await tc.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        accountStatus:
          role === USER_ROLE.blogger
            ? ACCOUNT_STATUS.pending
            : ACCOUNT_STATUS.active,
      },
    });
    // create the profile
    const profileCreateResult = await tc.profile.create({
      data: {
        firstName,
        lastName,
        profilePicture,
        userId: userCreateResult?.id,
        contactNo,
      },
    });
    // Create favourite categories using for...of loop
    for (const category of favouriteCategories) {
      await tc.favouriteCategory.create({
        data: {
          categoryId: category,
          profileId: profileCreateResult?.id,
        },
      });
    }
  });

  return {
    message: 'Signup Successful!',
  };
};

const login = async (payload: ILoginUser): Promise<ILoginResponse> => {
  const { email, password } = payload;
  // check user exists or not
  const isUserExists = await checkUserExistencyWithEmail(email);
  if (!isUserExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials');
  }
  //check passwoed matches or not
  const isPasswordValid = await comparePassword(
    password,
    isUserExists.password
  );
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }
  //get user profile
  let profile;
  if (isUserExists && isPasswordValid) {
    profile = await prisma.profile.findFirst({
      where: {
        userId: isUserExists.id,
      },
    });
  }
  //generate accesstoken for the user
  const accessToken = jwtHelpers.createToken(
    {
      userId: isUserExists.id,
      role: isUserExists.role,
      accountStatus: isUserExists.accountStatus,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  if (!accessToken) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An error occured.Please try again'
    );
  }

  return {
    accessToken,
    email: isUserExists.email,
    role: isUserExists.role,
    id: isUserExists.id,
    accountStatus: isUserExists.accountStatus,
    profilePicture: profile?.profilePicture as string,
  };
};

const persistLogin = async (payload: JwtPayload | null) => {
  const { userId } = payload as JwtPayload;

  const isExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  //get user profile
  let profile;
  if (isExists) {
    profile = await prisma.profile.findFirst({
      where: {
        userId: isExists.id,
      },
    });
  }

  return {
    email: isExists.email,
    role: isExists.role,
    id: isExists.id,
    accountStatus: isExists.accountStatus,
    profilePicture: profile?.profilePicture as string,
  };
};

export const AuthService = {
  signUp,
  login,
  persistLogin,
};
