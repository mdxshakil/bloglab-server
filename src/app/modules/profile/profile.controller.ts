import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProfileService } from './profile.service';

const updateBlogReadCount = catchAsync(async (req: Request, res: Response) => {
  const { profileId } = req.params;
  const result = await ProfileService.updateBlogReadCount(profileId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog read count updated',
    data: result,
  });
});

const getProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const { profileId } = req.params;
  const result = await ProfileService.getProfileInfo(profileId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile info retrived',
    data: result,
  });
});

export const ProfileController = {
  updateBlogReadCount,
  getProfileInfo,
};
