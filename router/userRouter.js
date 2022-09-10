import { Router } from 'express';
import userController from '../controllers/userController.js';
import { checkExistEmail } from '../middlewares/checkExistEmail.js';
import { checkPassword } from '../middlewares/checkPassword.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const userRouter = Router();

userRouter.post('/updateUserData', verifyToken, userController.updateUserData);
userRouter.post(
  '/changeEmail',
  verifyToken,
  checkExistEmail,
  checkPassword,
  userController.updateAuthData
);
userRouter.post(
  '/changePassword',
  verifyToken,
  checkPassword,
  userController.updateAuthData
);
userRouter.get('/users/searchUsers', verifyToken, userController.searchUsers);
userRouter.get('/users/otherUser', verifyToken, userController.otherUserData);

export default userRouter;
