import PostsService from '../services/PostsService.js';

const PostsController = {
  async createPost(req, res, next) {
    try {
      const { uid } = req.headers;
      const data = req.body;
      await PostsService.createPost(uid, data);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async getPosts(req, res, next) {
    try {
      const { uid } = req.headers;
      const posts = await PostsService.getPosts(uid);
      return res.json(posts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async getOtherUserPosts(req, res, next) {
    try {
      const uid = req.headers.data;
      const posts = await PostsService.getPosts(uid);
      return res.json(posts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async feedPosts(req, res, next) {
    try {
      const { uid } = req.headers;
      const posts = await PostsService.getFeedPosts(uid);
      return res.json(posts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async likePost(req, res, next) {
    try {
      const { uid } = req.headers;
      const { postId, ownerPost } = req.body;
      await PostsService.likePost(uid, postId, ownerPost);
      return res.end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default PostsController;
