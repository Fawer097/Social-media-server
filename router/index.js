import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

router.post('/auth/signUp', UserController.signUp);
router.post('/auth/signIn', UserController.signIn);
router.post('/auth/logout', UserController.logout);
router.get('/auth/verify', verifyToken, UserController.verifyToken);
router.get('/auth/refresh', UserController.refreshToken);
router.post('/updateUserData', verifyToken, UserController.updateUserData);

export default router;
