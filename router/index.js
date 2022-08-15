import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/auth/signUp', UserController.signUp);
router.post('/auth/signIn', UserController.signIn);
router.post('/auth/logout', UserController.logout);
router.get('/auth/refresh', UserController.refreshToken);
router.get('/userData', authMiddleware, UserController.userData);

export default router;
