import { FieldValue } from 'firebase-admin/firestore';
import dbService from './dbService.js';

const postsService = {
  async createPost(uid, data) {
    await dbService.setData('Posts', uid, {
      [`post${Date.now()}`]: {
        createdAt: FieldValue.serverTimestamp(),
        postId: Date.now(),
        uid,
        ...data,
        likes: [],
        comments: [],
      },
    });
    return;
  },

  async getPosts(uid) {
    const posts = await dbService.getData('Posts', uid);
    if (!posts) {
      return [];
    }
    return Object.values(posts);
  },

  async getFeedPosts(uid) {
    const { friends } = await dbService.getData('Friends', uid);
    const myPosts = await this.getPosts(uid);
    const postsArr = [];
    postsArr.push(...myPosts);

    for (let uid of friends) {
      const friendPosts = await this.getPosts(uid);
      postsArr.push(...friendPosts);
    }

    for (let post of postsArr) {
      const { avatarUrl, fullName } = await dbService.getData(
        'Users',
        post.uid
      );
      post.avatarUrl = avatarUrl;
      post.fullName = fullName;
    }
    return postsArr;
  },

  async likePost(uid, postId, ownerPost) {
    await dbService.updateDataInArray(
      'Posts',
      ownerPost,
      `post${postId}.likes`,
      uid
    );
    return;
  },

  async removeLikePost(uid, postId, ownerPost) {
    await dbService.removeDataInArray(
      'Posts',
      ownerPost,
      `post${postId}.likes`,
      uid
    );
    return;
  },
};

export default postsService;
