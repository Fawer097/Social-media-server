import FriendsService from '../services/FriendsService.js';

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

  async getFriendsData(req, res, next) {
    try {
      const { uid } = req.headers;
      const friendsData = await FriendsService.getFriendsData(uid);
      return res.json(friendsData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default FriendsController;
