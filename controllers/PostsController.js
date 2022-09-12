import postsService from '../services/postsService.js';

const postsController = {
  async createPost(req, res, next) {
    try {
      const { uid } = req.headers;
      const data = req.body;
      const posts = await postsService.createPost(uid, data);
      return res.json(posts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async deletePost(req, res, next) {
    try {
      const { uid } = req.headers;
      const { postId } = req.body;
      const posts = await postsService.deletePost(uid, postId);
      return res.json(posts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async updatePost(req, res, next) {
    try {
      const { uid } = req.headers;
      const data = req.body;
      const post = await postsService.updatePost(uid, data);
      return res.json(post);
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
      const postData = await postsService.likePost(uid, postId, ownerPost);
      return res.json(postData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async deleteLikePost(req, res, next) {
    try {
      const { uid } = req.headers;
      const { postId, ownerPost } = req.body;
      const postData = await postsService.deleteLikePost(
        uid,
        postId,
        ownerPost
      );
      return res.json(postData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async createComment(req, res, next) {
    try {
      const { uid } = req.headers;
      const data = req.body;
      const comments = await postsService.createComment(uid, data);
      return res.json(comments);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async updateComment(req, res, next) {
    try {
      const { uid } = req.headers;
      const data = req.body;
      const comment = await postsService.updateComment(uid, data);
      return res.json(comment);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async deleteComment(req, res, next) {
    try {
      const data = req.body;
      const comments = await postsService.deleteComment(data);
      return res.json(comments);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async getComments(req, res, next) {
    try {
      const { owneruid, postid } = req.headers;
      const comments = await postsService.getComments(owneruid, postid);
      return res.json(comments);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default postsController;
