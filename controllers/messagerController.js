import messagerService from '../services/messagerService.js';

const messagerController = {
  async setMessage(req, res, next) {
    try {
      const { uid } = req.headers;
      const { receiverUid, message } = req.body;
      await messagerService.setMessage(uid, receiverUid, message);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async chatsData(req, res, next) {
    try {
      const { uid } = req.headers;
      const chatsData = await messagerService.getChatsData(uid);
      return res.json(chatsData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default messagerController;
