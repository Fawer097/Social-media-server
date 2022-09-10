import { Router } from 'express';
import authController from '../controllers/authController.js';
import { checkExistEmail } from '../middlewares/checkExistEmail.js';
import { checkNonExistEmail } from '../middlewares/checkNonExistEmail.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkPassword } from '../middlewares/checkPassword.js';

const authRouter = Router();

authRouter.post('/auth/signUp', checkExistEmail, authController.signUp);
authRouter.post(
  '/auth/signIn',
  checkNonExistEmail,
  checkPassword,
  authController.signIn
);
authRouter.post('/auth/logout', authController.logout);
authRouter.get('/auth/verify', verifyToken, authController.verifyToken);
authRouter.get('/auth/refresh', authController.refreshToken);

export default authRouter;
