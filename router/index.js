import { Router } from 'express';
import FriendsController from '../controllers/FriendsController.js';
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
router.get('/users/searchUsers', verifyToken, UserController.searchUsers);
router.get('/users/otherUser', verifyToken, UserController.otherUserData);
router.post(
  '/friends/friendRequest',
  verifyToken,
  FriendsController.friendsRequest
);
router.get('/friends/allData', verifyToken, FriendsController.allFriendsData);
router.get('/friends/friendsData', verifyToken, FriendsController.friendsData);
router.get(
  '/friends/candidatesData',
  verifyToken,
  FriendsController.candidatesData
);
router.post('/messager/message', verifyToken, UserController.setMessage);
router.get('/messager/chatsData', verifyToken, UserController.chatsData);

export default router;
