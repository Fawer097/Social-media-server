import { Router } from 'express';
import galleryController from '../controllers/galleryController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const galleryRouter = Router();

galleryRouter.post(
  '/gallery/setImageLink',
  verifyToken,
  galleryController.setImageLink
);

galleryRouter.get(
  '/gallery/getImageLinks',
  verifyToken,
  galleryController.getImageLinks
);

export default galleryRouter;
