import { ACCOUNT_STATUS, BLOG_VISIBILITY, Blog } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { sendMail } from '../../../helpers/mailHelper';
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

  // Get the current date and set it to the beginning and end of the day.
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setHours(0, 0, 0, 0); // Start of the day (midnight).
  const endDate = new Date(currentDate);
  endDate.setHours(23, 59, 59, 999); // End of the day (11:59:59.999 PM).

  // Check if there are already 2 blogs posted by the user today.
  const blogsPostedToday = await prisma.blog.findMany({
    where: {
      authorId: authorProfileId,
      createdAt: {
        gte: startDate, // Greater than or equal to the start of the day.
        lte: endDate, // Less than or equal to the end of the day.
      },
    },
  });

  if (blogsPostedToday?.length >= 2) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You have already posted 2 blogs today'
    );
  }

  const contentLength = payload.content.length;
  const readingSpeed = 200; //200 word per minute
  const estimatedreadingTime = Math.ceil(contentLength / readingSpeed); //in minutes
  payload.timeToRead = estimatedreadingTime;

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
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit) || 1,
    },
    data: result,
  };
};

const approveBlogByAdmin = async (blogId: string, action: string) => {
  if (action === 'approve') {
    const result = await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        isApproved: true,
      },
      include: {
        author: {
          include: {
            user: true,
          },
        },
      },
    });
    try {
      await sendMail(
        result.author.user.email,
        'Blog approval',
        `Your blog ${result.title} has been ${
          result.isApproved ? 'approved.' : 'rejected.'
        }`
      );
      return {
        message: 'Blog approved',
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error'
      );
    }
  } else if (action === 'un approve') {
    const result = await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        isApproved: false,
      },
      include: {
        author: {
          include: {
            user: true,
          },
        },
      },
    });
    try {
      await sendMail(
        result.author.user.email,
        'Blog approval',
        `Your blog ${result.title} has been ${
          result.isApproved ? 'approved.' : 'un approved.'
        }`
      );
      return {
        message: 'Blog un approved',
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error'
      );
    }
  }
};

const getBlogsByUserPreference = async (
  profileId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Blog[]>> => {
  const whereConditions = [];
  const page = Number(paginationOptions.page);

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
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * 5,
    take: 5,
  });

  const total = await prisma.blog.count({
    where:
      whereConditions.length > 0
        ? { OR: whereConditions }
        : {
            isApproved: true,
            visibility: BLOG_VISIBILITY.public,
          },
  });

  return {
    meta: {
      page,
      limit: 3,
      total,
      pageCount: Math.ceil(total / 3),
    },
    data: preferredBlogs,
  };
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
    take: 6,
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

const getFeaturedBlogs = async (
  skip: number,
  limit: number
): Promise<Blog[]> => {
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
    skip: skip,
    take: limit,
  });

  return result;
};

const deleteBlogById = async (blogId: string): Promise<Blog | null> => {
  const result = await prisma.blog.delete({
    where: {
      id: blogId,
    },
  });

  return result;
};

const makeFeautred = async (
  blogId: string,
  action: string
): Promise<Blog | null | undefined> => {
  const numberOfFeaturedBlogs = await prisma.blog.count({
    where: {
      isFeatured: true,
    },
  });

  if (action === 'make featured') {
    // if (numberOfFeaturedBlogs >= 5) {
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     'Maximum 5 blogs can be in featured list'
    //   );
    // }
    return await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        isFeatured: true,
      },
    });
  } else if (action === 'remove featured') {
    if (numberOfFeaturedBlogs <= 2) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Atleast 2 blogs must be in featured list'
      );
    }
    return await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        isFeatured: false,
      },
    });
  }
};

const getBlogsBySearchTerm = async (
  searchTerm: string,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.blog.findMany({
    where: {
      title: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.blog.count({
    where: {
      title: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit) || 1,
    },
    data: result,
  };
};

const getMostLikedBlogs = async (): Promise<Blog[]> => {
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
      likeCount: 'desc',
    },
    take: 6,
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
  deleteBlogById,
  makeFeautred,
  getBlogsBySearchTerm,
  getMostLikedBlogs,
};
