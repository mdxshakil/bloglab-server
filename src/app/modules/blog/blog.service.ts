import { Blog } from '@prisma/client';
import prisma from '../../../shared/prisma';

const createNewBlog = async (
  payload: Blog,
): Promise<Blog> => {
  const result = await prisma.blog.create({
    data: payload,
  });

  return result;
};

export const BlogService = {
  createNewBlog,
};
