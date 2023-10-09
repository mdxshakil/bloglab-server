import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StatisticsService } from './statistics.service';

const getStatisticsData = catchAsync(async (req: Request, res: Response) => {
  const result = await StatisticsService.getStatisticsData();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Statistics data retrived',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);
  const filterOptions = pick(req.query, ['filter']);

  const result = await StatisticsService.getAllUsers(
    paginationOptions,
    filterOptions as { filter: string }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users data retrived',
    data: result,
  });
});

const addOrRemoveAdmin = catchAsync(async (req: Request, res: Response) => {
  const { userId, secretKey, action } = req.body;
  const result = await StatisticsService.addOrRemoveAdmin(
    userId,
    secretKey,
    action
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated',
    data: result,
  });
});

const blogsPerCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await StatisticsService.blogsPerCategory();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stats updateretrived',
    data: result,
  });
});

export const StatisticsController = {
  getStatisticsData,
  getAllUsers,
  addOrRemoveAdmin,
  blogsPerCategory,
};
