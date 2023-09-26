import { Category, FavouriteCategory } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ITransactionClient } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { ICategoryFollowUnfollowPayload } from './category.interface';

const createCategory = async (payload: Category): Promise<Category> => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategory = async (): Promise<Category[]> => {
  const result = await prisma.category.findMany({});

  return result;
};

const getSingleCategory = async (id: string): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const getUsersSelectedcategory = async (
  profileId: string
): Promise<FavouriteCategory[]> => {
  const userProfile = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
    include: {
      favouriteCategories: true,
    },
  });
  const categoryIds = userProfile?.favouriteCategories?.map(
    category => category.id
  );

  const result = await prisma.favouriteCategory.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
  });

  return result;
};

const followUnfollowCategory = async (
  payload: ICategoryFollowUnfollowPayload
): Promise<{ message: string }> => {
  const { profileId, categoryId } = payload || {};

  await prisma.$transaction(async (tc: ITransactionClient): Promise<void> => {
    const isAlreadySelected = await tc.favouriteCategory.findFirst({
      where: {
        categoryId,
        profileId,
      },
    });

    const totalCategoriesSelected = await tc.favouriteCategory.count({
      where: {
        profileId,
      },
    });

    if (totalCategoriesSelected === 2 && isAlreadySelected) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Minimum 2 categories must be selected'
      );
    }

    //if the category is already selected bu user then remove, otherwise add it
    if (isAlreadySelected) {
      await tc.favouriteCategory.delete({
        where: {
          id: isAlreadySelected.id,
        },
      });
    } else {
      await tc.favouriteCategory.create({
        data: {
          categoryId,
          profileId,
        },
      });
    }
  });
  return { message: 'Favourite category list updated successfully!' };
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  getUsersSelectedcategory,
  followUnfollowCategory,
};
