import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import { checkExistEmail } from '../middlewares/checkExistEmail.js';
import { checkNonExistEmail } from '../middlewares/checkNonExistEmail.js';
import { checkPassword } from '../middlewares/checkPassword.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

router.post('/auth/signUp', checkExistEmail, UserController.signUp);
router.post(
  '/auth/signIn',
  checkNonExistEmail,
  checkPassword,
  UserController.signIn
);
router.post('/auth/logout', UserController.logout);
router.get('/auth/verify', verifyToken, UserController.verifyToken);
router.get('/auth/refresh', UserController.refreshToken);
router.post('/updateUserData', verifyToken, UserController.updateUserData);
router.post(
  '/changeEmail',
  verifyToken,
  checkExistEmail,
  checkPassword,
  UserController.updateAuthData
);
router.post(
  '/changePassword',
  verifyToken,
  checkPassword,
  UserController.updateAuthData
);

export default router;
