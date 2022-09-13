import { Router } from 'express';
import messagerController from '../controllers/messagerController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const messagerRouter = Router();

messagerRouter.post(
  '/messager/message',
  verifyToken,
  messagerController.setMessage
);
messagerRouter.post(
  '/messager/deleteMessage',
  verifyToken,
  messagerController.deleteMessage
);

messagerRouter.post(
  '/messager/deleteChat',
  verifyToken,
  messagerController.deleteChat
);

export default messagerRouter;
