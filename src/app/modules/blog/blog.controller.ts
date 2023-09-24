import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
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

export const BlogController = {
  createNewBlog,
};
