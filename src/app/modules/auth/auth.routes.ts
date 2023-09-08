import express from 'express';
import prisma from '../../../shared/prisma';
const router = express.Router();

router.post('/', async (req, res) => {
  const result = await prisma.test.create({
    data: {
      userName: 'Test name',
    },
  });
  res.send(result);
});

export const AuthRoutes = router;
