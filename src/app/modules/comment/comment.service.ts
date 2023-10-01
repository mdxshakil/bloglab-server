import { Comment, Reply } from '@prisma/client';
import prisma from '../../../shared/prisma';

const addComment = async (payload: {
  comment: string;
  profileId: string;
  blogId: string;
}): Promise<Comment> => {
  const result = await prisma.comment.create({
    data: payload,
    include: {
      profile: true,
    },
  });

  return result;
};

const getAllComments = async (blogId: string): Promise<Comment[]> => {
  const result = await prisma.comment.findMany({
    where: {
      blogId,
    },
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

const addReply = async (payload: {
  reply: string;
  profileId: string;
  commentId: string;
}): Promise<Reply> => {
  const result = await prisma.reply.create({
    data: payload,
    include: {
      profile: true,
    },
  });

  return result;
};

const getAllReplies = async (commentId: string): Promise<Reply[]> => {
  const result = await prisma.reply.findMany({
    where: {
      commentId,
    },
    include: {
      profile: true,
    },
  });
  return result;
};

export const CommentService = {
  addComment,
  getAllComments,
  addReply,
  getAllReplies,
};
