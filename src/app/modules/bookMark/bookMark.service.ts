import { BookMark } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const addToBookMark = async (payload: {
  profileId: string;
  blogId: string;
}): Promise<BookMark> => {
  const isAlreadyAdded = await prisma.bookMark.findFirst({
    where: {
      blogId: payload.blogId,
      profileId: payload.profileId,
    },
  });
  if (isAlreadyAdded) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already in bookmark');
  }
  const result = await prisma.bookMark.create({
    data: payload,
    include: {
      blog: {
        include: {
          author: true,
          category: true,
        },
      },
    },
  });

  return result;
};

const removeFromBookMark = async (payload: {
  blogId: string;
  profileId: string;
}): Promise<{ message: string }> => {
  await prisma.bookMark.deleteMany({
    where: {
      blogId: payload.blogId,
      profileId: payload.profileId,
    },
  });

  return { message: 'Removed from bookmark' };
};

const getBookMarkList = async (profileId: string): Promise<BookMark[]> => {
  const result = await prisma.bookMark.findMany({
    where: {
      profileId,
    },
    include: {
      blog: {
        include: {
          author: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

export const BookMarkService = {
  addToBookMark,
  removeFromBookMark,
  getBookMarkList,
};
