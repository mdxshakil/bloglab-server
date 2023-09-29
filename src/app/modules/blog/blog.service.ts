import { ACCOUNT_STATUS, BLOG_VISIBILITY, Blog } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  IGenericResponse,
  ITransactionClient,
} from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IBlogFilterableFieldsForAdmin } from './blog.interface';

const createNewBlog = async (payload: Blog): Promise<Blog> => {
  const author = await prisma.user.findUnique({
    where: {
      id: payload.authorId,
    },
    include: {
      profile: true,
    },
  });
  const authorProfileId = author?.profile?.id;

  const result = await prisma.blog.create({
    data: { ...payload, authorId: authorProfileId as string },
  });

  return result;
};

const getBlogsForAdminDashboard = async (
  paginationOptions: IPaginationOptions,
  filterOptions: IBlogFilterableFieldsForAdmin
): Promise<IGenericResponse<Blog[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (filterOptions) {
    if (filterOptions.isApproved === 'approved') {
      andConditions.push({
        isApproved: true,
      });
    } else if (filterOptions.isApproved === 'pending') {
      andConditions.push({
        isApproved: false,
      });
    } else if (filterOptions.isFeatured === 'featured') {
      andConditions.push({
        isFeatured: true,
      });
    }
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    include: {
      author: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: skip,
    take: limit,
  });

  const total = await prisma.blog.count({
    where: {
      isApproved: false,
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    },
    data: result,
  };
};

const approveBlogByAdmin = async (blogId: string) => {
  await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: {
      isApproved: true,
    },
  });

  return {
    message: 'Blog approved',
  };
};

const getBlogsByUserPreference = async (profileId: string): Promise<Blog[]> => {
  const whereConditions = [];

  //if user is logged in then show preferred blogs, if user is not logged in show him all blogs
  if (profileId) {
    //find the user profile to get the preferred categories of the user
    const userProfile = await prisma.profile.findUnique({
      where: {
        id: profileId,
      },
      include: {
        favouriteCategories: {
          select: {
            categoryId: true,
          },
        },
      },
    });

    //extract category ids from preferredcategories
    if (userProfile) {
      const preferredCategoryIds = userProfile.favouriteCategories.map(
        category => category.categoryId
      );

      whereConditions.push({
        AND: [
          {
            categoryId: {
              in: preferredCategoryIds,
            },
          },
          {
            isApproved: true,
            visibility: BLOG_VISIBILITY.public,
          },
        ],
      });
    }
  }
  //if user is logged in then show preferred blogs, if user is not logged in show him all blogs
  const preferredBlogs = await prisma.blog.findMany({
    where:
      whereConditions.length > 0
        ? { OR: whereConditions }
        : {
            isApproved: true,
            visibility: BLOG_VISIBILITY.public,
          },
    include: {
      category: true,
      author: true,
      likes: true,
    },
  });
  return preferredBlogs;
};

const getBlogById = async (blogId: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id: blogId,
      isApproved: true,
      visibility: BLOG_VISIBILITY.public,
    },
    include: {
      author: true,
      category: true,
    },
  });

  return result;
};

const getBlogsByAuthorId = async (authorId: string): Promise<Blog[]> => {
  const result = await prisma.blog.findMany({
    where: {
      authorId,
      isApproved: true,
      visibility: BLOG_VISIBILITY.public,
    },
    include: {
      author: true,
      category: true,
    },
  });

  return result;
};

const getLatestBlogs = async (): Promise<Blog[]> => {
  const result = await prisma.blog.findMany({
    where: {
      isApproved: true,
      visibility: BLOG_VISIBILITY.public,
    },
    include: {
      author: true,
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return result;
};

const likeBlog = async (
  blogId: string,
  likerId: string
): Promise<{ message: string }> => {
  let message = '';

  await prisma.$transaction(async (tc: ITransactionClient): Promise<void> => {
    // find the liker
    const liker = await tc.profile.findUnique({
      where: {
        id: likerId,
      },
      include: {
        user: true,
      },
    });
    // find the liked blog
    const likedBlog = await tc.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (liker?.user?.accountStatus !== ACCOUNT_STATUS.active) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Can't perform this action while the account is not active"
      );
    }
    //check if already liked or not
    const isAlreadyLiked = await tc.like.findFirst({
      where: {
        likerId,
        blogId,
      },
    });

    if (likedBlog) {
      if (isAlreadyLiked) {
        //delete the like
        await tc.like.delete({
          where: {
            id: isAlreadyLiked.id,
          },
        });
        //decrease total like count from blog
        await tc.blog.update({
          where: {
            id: blogId,
          },
          data: {
            likeCount: (likedBlog.likeCount || 0) - 1,
          },
        });

        message = 'Like removed';
      } else {
        //post the like
        await tc.like.create({
          data: {
            likerId,
            blogId,
          },
        });
        //increase total like count from blog
        await tc.blog.update({
          where: {
            id: blogId,
          },
          data: {
            likeCount: (likedBlog.likeCount || 0) + 1,
          },
        });
        message = 'Like added';
      }
    }
  });
  return { message };
};

const getFeaturedBlogs = async (): Promise<Blog[]> => {
  const result = await prisma.blog.findMany({
    where: {
      isApproved: true,
      visibility: BLOG_VISIBILITY.public,
      isFeatured: true,
    },
    include: {
      author: true,
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

export const BlogService = {
  createNewBlog,
  getBlogsForAdminDashboard,
  approveBlogByAdmin,
  getBlogsByUserPreference,
  getBlogById,
  getBlogsByAuthorId,
  getLatestBlogs,
  likeBlog,
  getFeaturedBlogs,
};
