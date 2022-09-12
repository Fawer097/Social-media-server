import galleryService from '../services/galleryService.js';

const galleryController = {
  async setImageLink(req, res, next) {
    try {
      const { uid } = req.headers;
      const { link } = req.body;
      await galleryService.setImageLink(uid, link);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async getImageLinks(req, res, next) {
    try {
      const uid = req.headers.data;
      const links = await galleryService.getImageLinks(uid);
      return res.json(links);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default galleryController;
