import messagerService from '../services/messagerService.js';

const messagerController = {
  async setMessage(req, res, next) {
    try {
      const { uid } = req.headers;
      const { receiverUid, data } = req.body;
      await messagerService.setMessage(uid, receiverUid, data);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async deleteMessage(req, res, next) {
    try {
      const { uid } = req.headers;
      const { receiverUid, messageId } = req.body;
      await messagerService.deleteMessage(uid, receiverUid, messageId);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async deleteChat(req, res, next) {
    try {
      const { uid } = req.headers;
      const { interlocutor } = req.body;
      await messagerService.deleteChat(uid, interlocutor);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default messagerController;
