import friendsService from '../services/friendsService.js';
import dbService from '../services/dbService.js';

const friendsController = {
  async friendsRequest(req, res, next) {
    try {
      const senderUid = req.headers.uid;
      const { receiverUid } = req.body;
      const firstCheck = await friendsService.checkFriends(
        senderUid,
        receiverUid
      );
      if (!firstCheck) {
        await friendsService.setIncomingRequests(senderUid, receiverUid);
        await friendsService.setOutgoingRequests(senderUid, receiverUid);
      }
      const secondCheck = await friendsService.checkFriends(
        senderUid,
        receiverUid
      );
      if (secondCheck) {
        await friendsService.setFriend(senderUid, receiverUid);
      }
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async removeOutgoingRequest(req, res, next) {
    try {
      const senderUid = req.headers.uid;
      const { receiverUid } = req.body;
      await friendsService.removeOutgoingRequest(senderUid, receiverUid);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async removeIncomingRequest(req, res, next) {
    try {
      const senderUid = req.headers.uid;
      const { receiverUid } = req.body;
      await friendsService.removeIncomingRequest(senderUid, receiverUid);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async removeFriend(req, res, next) {
    try {
      const senderUid = req.headers.uid;
      const { receiverUid } = req.body;
      await friendsService.removeFriend(senderUid, receiverUid);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async friendsUid(req, res, next) {
    try {
      const uid = req.headers.data;
      const friendsUid = await dbService.getData('Friends', uid);
      return res.json(friendsUid);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async friendsData(req, res, next) {
    try {
      const uid = req.headers.data;
      const friendsData = await friendsService.getFriendsData(uid);
      return res.json(friendsData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async candidatesData(req, res, next) {
    try {
      const { uid } = req.headers;
      const candidatesData = await friendsService.getCandidatesData(uid);
      return res.json(candidatesData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async outgoingCandidatesData(req, res, next) {
    try {
      const { uid } = req.headers;
      const candidatesData = await friendsService.getOutgoingCandidatesData(
        uid
      );
      return res.json(candidatesData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default friendsController;
