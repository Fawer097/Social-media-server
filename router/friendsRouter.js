import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import friendsController from '../controllers/friendsController.js';

const userRouter = Router();

userRouter.post(
  '/friends/friendRequest',
  verifyToken,
  friendsController.friendsRequest
);
userRouter.post(
  '/friends/removeOutgoingRequest',
  verifyToken,
  friendsController.removeOutgoingRequest
);
userRouter.post(
  '/friends/removeIncomingRequest',
  verifyToken,
  friendsController.removeIncomingRequest
);
userRouter.post(
  '/friends/removeFriend',
  verifyToken,
  friendsController.removeFriend
);
userRouter.get(
  '/friends/allData',
  verifyToken,
  friendsController.allFriendsData
);
userRouter.get(
  '/friends/friendsData',
  verifyToken,
  friendsController.friendsData
);
userRouter.get(
  '/friends/candidatesData',
  verifyToken,
  friendsController.candidatesData
);
userRouter.get(
  '/friends/outgoingCandidatesData',
  verifyToken,
  friendsController.outgoingCandidatesData
);

export default userRouter;
