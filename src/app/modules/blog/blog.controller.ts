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

const getBlogsForAdminDashboard = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationFields);
    const filterOptions = pick(req.query, ['isApproved', 'isFeatured']);

    const result = await BlogService.getBlogsForAdminDashboard(
      paginationOptions,
      filterOptions
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Pending blogs retrived successfully',
      data: result,
    });
  }
);

const approveBlogByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { blogId, action } = req.body;
  const result = await BlogService.approveBlogByAdmin(blogId, action);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Approved',
    data: result,
  });
});

const getBlogsByUserPreference = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.query;

    const paginationOptions = pick(req.query, paginationFields);
    const result = await BlogService.getBlogsByUserPreference(
      userId as string,
      paginationOptions
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blogs retrived',
      data: result,
    });
  }
);

const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const result = await BlogService.getBlogById(blogId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog retrived',
    data: result,
  });
});

const getBlogsByAuthorId = catchAsync(async (req: Request, res: Response) => {
  const { authorId } = req.params;

  const result = await BlogService.getBlogsByAuthorId(authorId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs retrived',
    data: result,
  });
});

const getLatestBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getLatestBlogs();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Latest Blogs retrived',
    data: result,
  });
});

const likeBlog = catchAsync(async (req: Request, res: Response) => {
  const { blogId, likerId } = req.body;
  const result = await BlogService.likeBlog(blogId, likerId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Like action succed',
    data: result,
  });
});

const getFeaturedBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getFeaturedBlogs();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Featured Blogs retrived',
    data: result,
  });
});

const deleteBlogById = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  const result = await BlogService.deleteBlogById(blogId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted',
    data: result,
  });
});

const makeFeatured = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const { action } = req.body;

  const result = await BlogService.makeFeautred(blogId as string, action);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Featured list updated',
    data: result,
  });
});

export const BlogController = {
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
  makeFeatured,
};
