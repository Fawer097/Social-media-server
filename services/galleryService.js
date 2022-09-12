import dbService from './dbService.js';

const galleryService = {
  async setImageLink(uid, link) {
    await dbService.setData('Gallery', uid, {
      [`image${Date.now()}`]: { link, createdAt: Date.now() },
    });
    return;
  },

  async getImageLinks(uid) {
    const links = await dbService.getData('Gallery', uid);
    if (!links) {
      return [];
    }
    return Object.values(links);
  },
};

export default galleryService;
