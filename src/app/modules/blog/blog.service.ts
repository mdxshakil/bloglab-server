import { Blog } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const createNewBlog = async (payload: Blog): Promise<Blog> => {
  const result = await prisma.blog.create({
    data: payload,
  });

  return result;
};

const getPendingBlogs = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Blog[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.blog.findMany({
    where: {
      isApproved: false,
    },
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

export const BlogService = {
  createNewBlog,
  getPendingBlogs,
  approveBlogByAdmin,
};
