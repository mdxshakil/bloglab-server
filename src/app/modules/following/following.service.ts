import { Follower } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const followBlogger = async (data: Follower): Promise<Follower | null> => {
  //check if already following or not
  const isFollowing = await prisma.following.findFirst({
    where: {
      userId: data.followerId,
      followingId: data.authorId,
    },
  });
  if (isFollowing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are already following this account.'
    );
  }
  const followerResult = await prisma.follower.create({ data });
  const followingResult = await prisma.following.create({
    data: { followingId: data.authorId, userId: data.followerId },
  });
  if (!followerResult.id || !followingResult.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to perform this action');
  }
  return followerResult;
};

const isAlreadyFollowing = async (data: {
  userId: string;
  followingId: string;
}): Promise<boolean> => {
  //check if already following or not

  const isFollowing = await prisma.following.findFirst({
    where: {
      userId: data.userId,
      followingId: data.followingId,
    },
  });
  if (isFollowing) {
    return true;
  } else {
    return false;
  }
};

export const FollowingService = {
  followBlogger,
  isAlreadyFollowing,
};
