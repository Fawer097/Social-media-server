import postsService from '../services/postsService.js';

const postsController = {
  async createPost(req, res, next) {
    try {
      const { uid } = req.headers;
      const data = req.body;
      await postsService.createPost(uid, data);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async getPosts(req, res, next) {
    try {
      const { uid } = req.headers;
      const posts = await postsService.getPosts(uid);
      return res.json(posts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async getOtherUserPosts(req, res, next) {
    try {
      const uid = req.headers.data;
      const posts = await postsService.getPosts(uid);
      return res.json(posts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async feedPosts(req, res, next) {
    try {
      const { uid } = req.headers;
      const posts = await postsService.getFeedPosts(uid);
      return res.json(posts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async likePost(req, res, next) {
    try {
      const { uid } = req.headers;
      const { postId, ownerPost } = req.body;
      await postsService.likePost(uid, postId, ownerPost);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async removeLikePost(req, res, next) {
    try {
      const { uid } = req.headers;
      const { postId, ownerPost } = req.body;
      await postsService.removeLikePost(uid, postId, ownerPost);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default postsController;
