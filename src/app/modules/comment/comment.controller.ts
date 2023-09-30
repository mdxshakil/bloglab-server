import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CommentService } from './comment.service';

const addComment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await CommentService.addComment(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment added',
    data: result,
  });
});

const getAllComments = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  const result = await CommentService.getAllComments(blogId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrived',
    data: result,
  });
});

const addReply = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await CommentService.addReply(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reply added',
    data: result,
  });
});

export const CommentController = { addComment, getAllComments, addReply };
