import { Router } from 'express';
import messagerController from '../controllers/messagerController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const messagerRouter = Router();

messagerRouter.post(
  '/messager/message',
  verifyToken,
  messagerController.setMessage
);
messagerRouter.get(
  '/messager/chatsData',
  verifyToken,
  messagerController.chatsData
);

export default messagerRouter;
