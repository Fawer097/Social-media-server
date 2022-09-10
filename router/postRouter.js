import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import postsController from '../controllers/postsController.js';

const postRouter = Router();

postRouter.post('/posts/createPost', verifyToken, postsController.createPost);
postRouter.get('/posts/userPosts', verifyToken, postsController.getPosts);
postRouter.get(
  '/posts/otherUserPosts',
  verifyToken,
  postsController.getOtherUserPosts
);
postRouter.get('/posts/feedPosts', verifyToken, postsController.feedPosts);
postRouter.post('/posts/likePost', verifyToken, postsController.likePost);
postRouter.post(
  '/posts/removeLikePost',
  verifyToken,
  postsController.removeLikePost
);

export default postRouter;
