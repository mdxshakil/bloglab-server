import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookMarkService } from './bookMark.service';

const addToBookMark = catchAsync(async (req: Request, res: Response) => {
  const { blogId, profileId } = req.body;

  const result = await BookMarkService.addToBookMark({ blogId, profileId });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Added to bookmark',
    data: result,
  });
});

const removeFromBookMark = catchAsync(async (req: Request, res: Response) => {
  const blogId = req.query.blogId as string;
  const profileId = req.query.profileId as string;

  const result = await BookMarkService.removeFromBookMark({
    blogId,
    profileId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Removed from bookmark',
    data: result,
  });
});

const getBookMarkList = catchAsync(async (req: Request, res: Response) => {
  const { profileId } = req.query;

  const result = await BookMarkService.getBookMarkList(profileId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookmark list retrived',
    data: result,
  });
});

export const BookMarkController = {
  addToBookMark,
  removeFromBookMark,
  getBookMarkList,
};
