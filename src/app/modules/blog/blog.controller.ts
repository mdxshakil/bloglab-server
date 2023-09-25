import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BlogService } from './blog.service';

const createNewBlog = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const banner = config.server_host + '/banner/' + req.file?.filename;
  const payload = {
    ...req.body,
    banner,
    authorId: user?.userId,
  };

  const result = await BlogService.createNewBlog(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New blog created successfully',
    data: result,
  });
});

const getPendingBlogs = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BlogService.getPendingBlogs(paginationOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pending blogs retrived successfully',
    data: result,
  });
});

const approveBlogByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.body;
  const result = await BlogService.approveBlogByAdmin(blogId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Approved',
    data: result,
  });
});

export const BlogController = {
  createNewBlog,
  getPendingBlogs,
  approveBlogByAdmin,
};
