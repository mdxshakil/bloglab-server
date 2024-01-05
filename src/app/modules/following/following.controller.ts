import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FollowingService } from './following.service';

const followBlogger = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await FollowingService.followBlogger(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Following successful',
    data: result,
  });
});

const isAlreadyFollowing = catchAsync(async (req: Request, res: Response) => {
  const { userId, followingId } = req.query;

  const result = await FollowingService.isAlreadyFollowing({
    userId: userId as string,
    followingId: followingId as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Following information retrived',
    data: result,
  });
});

export const FollowingController = {
  followBlogger,
  isAlreadyFollowing,
};
