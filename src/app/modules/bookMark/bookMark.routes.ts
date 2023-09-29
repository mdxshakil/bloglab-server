import express from 'express';
import { BookMarkController } from './bookMark.controller';
const router = express.Router();

router.post('/add-to-bookMark', BookMarkController.addToBookMark);
router.delete(
  '/remove-from-bookMark',
  BookMarkController.removeFromBookMark
);
router.get('/', BookMarkController.getBookMarkList);

export const BookMarkRoutes = router;
