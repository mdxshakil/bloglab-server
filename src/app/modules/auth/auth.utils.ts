import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';

export const checkUserExistencyWithEmail = async (
  email: string
): Promise<User | null> => {
  const result = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  return result;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
