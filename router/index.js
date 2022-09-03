import { Router } from 'express';
import Controller from '../controllers/Controller.js';
import { checkExistEmail } from '../middlewares/checkExistEmail.js';
import { checkNonExistEmail } from '../middlewares/checkNonExistEmail.js';
import { checkPassword } from '../middlewares/checkPassword.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

router.post('/auth/signUp', checkExistEmail, Controller.signUp);
router.post(
  '/auth/signIn',
  checkNonExistEmail,
  checkPassword,
  Controller.signIn
);
router.post('/auth/logout', Controller.logout);
router.get('/auth/verify', verifyToken, Controller.verifyToken);
router.get('/auth/refresh', Controller.refreshToken);
router.post('/updateUserData', verifyToken, Controller.updateUserData);
router.post(
  '/changeEmail',
  verifyToken,
  checkExistEmail,
  checkPassword,
  Controller.updateAuthData
);
router.post(
  '/changePassword',
  verifyToken,
  checkPassword,
  Controller.updateAuthData
);
router.get('/users/searchUsers', verifyToken, Controller.searchUsers);
router.get('/users/oneUser', verifyToken, Controller.getOneUserData);
router.post('/friends/candidate', verifyToken, Controller.friendRequest);

export default router;
