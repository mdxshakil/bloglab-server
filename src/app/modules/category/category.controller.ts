import { Category } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await CategoryService.createCategory(data);

  sendResponse<Category>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New category created successfully',
    data: result,
  });
});

const editCategory = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const { categoryId } = req.params;

  const result = await CategoryService.editCategory(data, categoryId as string);

  sendResponse<Category>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category edited successfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategory();

  sendResponse<Category[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories fetched successfully',
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getSingleCategory(id);

  sendResponse<Category>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category fetched successfully',
    data: result,
  });
});

const getUsersSelectedcategory = catchAsync(
  async (req: Request, res: Response) => {
    const { profileId } = req.query;
    const result = await CategoryService.getUsersSelectedcategory(
      profileId as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Favourite categories fetched successfully',
      data: result,
    });
  }
);

const followUnfollowCategory = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;

    const result = await CategoryService.followUnfollowCategory(data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'favourite Category list updated successfully',
      data: result,
    });
  }
);

const getCategorizedBlogs = catchAsync(async (req: Request, res: Response) => {
  const { categoryTitle } = req.params;
  const paginationOptions = pick(req.query, paginationFields);
  
  const result = await CategoryService.getCategorizedBlogs(
    categoryTitle,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs retrived acording category',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  editCategory,
  getAllCategory,
  getSingleCategory,
  getUsersSelectedcategory,
  followUnfollowCategory,
  getCategorizedBlogs,
};
