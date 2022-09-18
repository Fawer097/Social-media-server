import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import postsController from '../controllers/postsController.js';

const postRouter = Router();

postRouter.post('/posts/createPost', verifyToken, postsController.createPost);
postRouter.post('/posts/deletePost', verifyToken, postsController.deletePost);
postRouter.post('/posts/updatePost', verifyToken, postsController.updatePost);
postRouter.get('/posts/userPosts', verifyToken, postsController.getPosts);
postRouter.get('/posts/feedPosts', verifyToken, postsController.feedPosts);
postRouter.post('/posts/likePost', verifyToken, postsController.likePost);
postRouter.post(
  '/posts/deleteLikePost',
  verifyToken,
  postsController.deleteLikePost
);
postRouter.post(
  '/posts/createComment',
  verifyToken,
  postsController.createComment
);

postRouter.post(
  '/posts/updateComment',
  verifyToken,
  postsController.updateComment
);
postRouter.post(
  '/posts/deleteComment',
  verifyToken,
  postsController.deleteComment
);
postRouter.get('/posts/Comments', verifyToken, postsController.getComments);

export default postRouter;
