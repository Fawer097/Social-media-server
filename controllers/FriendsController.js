import FriendsService from '../services/FriendsService.js';
import DbService from '../services/DbService.js';

const FriendsController = {
  async friendsRequest(req, res, next) {
    try {
      const senderUid = req.headers.uid;
      const { receiverUid } = req.body;
      const firstCheck = await FriendsService.checkFriends(
        senderUid,
        receiverUid
      );
      if (!firstCheck) {
        await FriendsService.setIncomingRequests(senderUid, receiverUid);
        await FriendsService.setOutgoingRequests(senderUid, receiverUid);
      }
      const secondCheck = await FriendsService.checkFriends(
        senderUid,
        receiverUid
      );
      if (secondCheck) {
        await FriendsService.setFriends(senderUid, receiverUid);
      }
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async allFriendsData(req, res, next) {
    try {
      const { uid } = req.headers;
      const allFriendsData = await DbService.getData('Friends', uid);
      return res.json(allFriendsData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async friendsData(req, res, next) {
    try {
      const { uid } = req.headers;
      const friendsData = await FriendsService.getFriendsData(uid);
      return res.json(friendsData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async candidatesData(req, res, next) {
    try {
      const { uid } = req.headers;
      const candidatesData = await FriendsService.getCandidatesData(uid);
      return res.json(candidatesData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default FriendsController;
