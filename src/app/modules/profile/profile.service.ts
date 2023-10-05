import { READER_LEVEL } from '@prisma/client';
import prisma from '../../../shared/prisma';

const updateBlogReadCount = async (profileId: string) => {
  // find user profile
  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
  });

  // Increment the totalBlogRead count by 1
  const updatedTotalBlogRead = (profile?.totalBlogRead as number) + 1;

  // Determine the reader level based on the updatedTotalBlogRead
  let readerLevel: READER_LEVEL = READER_LEVEL.newbie;

  if (updatedTotalBlogRead >= 3) {
    readerLevel = READER_LEVEL.super;
  } else if (updatedTotalBlogRead >= 200) {
    readerLevel = READER_LEVEL.engaged;
  } else if (updatedTotalBlogRead >= 100) {
    readerLevel = READER_LEVEL.regular;
  } else if (updatedTotalBlogRead >= 50) {
    readerLevel = READER_LEVEL.casual;
  }

  //update number of total blog read and reader level
  const result = await prisma.profile.update({
    where: {
      id: profileId,
    },
    data: {
      totalBlogRead: (profile?.totalBlogRead as number) + 1,
      readerLevel: readerLevel,
    },
  });

  return result;
};

export const ProfileService = {
  updateBlogReadCount,
};
