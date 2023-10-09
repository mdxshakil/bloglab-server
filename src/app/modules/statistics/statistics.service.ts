import { ACCOUNT_STATUS, USER_ROLE } from '@prisma/client';
import httpStatus from 'http-status';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { ITransactionClient } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const getStatisticsData = async () => {
  // Calculate the date 7 days ago from the current date
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  //todays date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of the day
  let result = {};
  await prisma.$transaction(async (tc: ITransactionClient): Promise<void> => {
    const totalActiveUsersCount = await tc.user.count({
      where: {
        role: {
          not: ENUM_USER_ROLE.ADMIN,
        },
        accountStatus: ACCOUNT_STATUS.active,
      },
    });
    const newUsersInThisWeek = await tc.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
          lte: new Date(),
        },
        role: {
          not: ENUM_USER_ROLE.ADMIN,
        },
      },
    });
    const newUsersToday = await tc.user.count({
      where: {
        createdAt: {
          gte: today,
        },
        role: {
          not: ENUM_USER_ROLE.ADMIN,
        },
      },
    });
    const totalActiveBloggers = await tc.user.count({
      where: {
        role: {
          equals: 'blogger',
        },
        accountStatus: ACCOUNT_STATUS.active,
      },
    });
    const totalActiveReaders = await tc.user.count({
      where: {
        role: {
          equals: 'reader',
        },
        accountStatus: ACCOUNT_STATUS.active,
      },
    });
    const totalApprovedBlogsCount = await tc.blog.count({
      where: {
        isApproved: true,
      },
    });
    const newBlogsInThisWeek = await tc.blog.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
          lte: new Date(),
        },
      },
    });
    const newBlogsToday = await tc.blog.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });
    result = {
      totalActiveUsersCount,
      newUsersInThisWeek,
      newUsersToday,
      totalActiveBloggers,
      totalActiveReaders,
      totalApprovedBlogsCount,
      newBlogsInThisWeek,
      newBlogsToday,
    };
  });

  return result;
};

const getAllUsers = async (
  paginationOptions: IPaginationOptions,
  filterOptions: { filter: string }
) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  let andConditions = [];

  if (filterOptions) {
    if (filterOptions.filter === 'admin') {
      andConditions.push({
        user: {
          role: ENUM_USER_ROLE.ADMIN,
        },
      });
    } else if (filterOptions.filter === 'blogger') {
      andConditions.push({
        user: {
          role: ENUM_USER_ROLE.BLOGGER,
        },
      });
    } else if (filterOptions.filter === 'reader') {
      andConditions.push({
        user: {
          role: ENUM_USER_ROLE.READER,
        },
      });
    } else if (filterOptions.filter === 'active') {
      andConditions.push({
        user: {
          accountStatus: ACCOUNT_STATUS.active,
        },
      });
    } else if (filterOptions.filter === 'pending') {
      andConditions.push({
        user: {
          accountStatus: ACCOUNT_STATUS.pending,
        },
      });
    } else {
      andConditions = [];
    }
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.profile.findMany({
    where: whereConditions,
    include: {
      user: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    take: limit,
    skip,
  });

  const total = await prisma.profile.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
      pageCount: Math.ceil(total / limit) || 1,
    },
    data: result,
  };
};

const addOrRemoveAdmin = async (
  userId: string,
  secretKey: string,
  action: string
) => {
  if (secretKey !== config.admin_secret_key) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong secret key!');
  }
  await prisma.$transaction(async (tc: ITransactionClient): Promise<void> => {
    const admins = await tc.user.findMany({
      where: {
        role: USER_ROLE.admin,
      },
    });
    //atleast 1 admin is necessary
    if (admins.length <= 1 && action === 'remove admin') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'All the admins can not be removed!'
      );
    }
    const user = await tc.user.findUnique({
      where: {
        id: userId,
      },
    });

    //default admin can not be removed
    if (user?.email === config.main_admin_email) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Main admin can not be removed!'
      );
    }
    if (action === 'make admin') {
      //if account is not active,active it while making admin
      await tc.user.update({
        where: {
          id: userId,
        },
        data: {
          role: USER_ROLE.admin,
          accountStatus: ACCOUNT_STATUS.active,
        },
      });
    } else if (action === 'remove admin') {
      //remove admin and make account status pending
      await tc.user.update({
        where: {
          id: userId,
        },
        data: {
          role: user?.roleHistory,
          accountStatus: ACCOUNT_STATUS.pending,
        },
      });
    }
  });
  return {
    message:
      action === 'make admin'
        ? 'New admin created successfully!'
        : 'Admin removed successfully',
  };
};

const blogsPerCategory = async () => {
  const blogCounts = await prisma.category.findMany({
    select: {
      title: true,
      _count: {
        select: {
          blogs: true,
        },
      },
    },
  });

  return blogCounts;
};

export const StatisticsService = {
  getStatisticsData,
  getAllUsers,
  addOrRemoveAdmin,
  blogsPerCategory,
};
