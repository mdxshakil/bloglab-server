import express from 'express';
import { CommentController } from './comment.controller';
const router = express.Router();

router.post('/add-comment', CommentController.addComment);
router.post('/add-reply', CommentController.addReply);
router.get('/get-all-comment/:blogId', CommentController.getAllComments);
router.get('/get-all-reply/:commentId', CommentController.getAllReplies);

export const CommentRoutes = router;
