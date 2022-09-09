import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../firebase/firebaseInit.js';
import DbService from './DbService.js';

const PostsService = {
  async createPost(uid, data) {
    await DbService.setData('Posts', uid, {
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
    const posts = await DbService.getData('Posts', uid);
    if (!posts) {
      return [];
    }
    return Object.values(posts);
  },

  async getFeedPosts(uid) {
    const { friends } = await DbService.getData('Friends', uid);
    const myPosts = await this.getPosts(uid);
    const postsArr = [];
    postsArr.push(...myPosts);

    for (let uid of friends) {
      const friendPosts = await this.getPosts(uid);
      postsArr.push(...friendPosts);
    }

    for (let post of postsArr) {
      const { avatarUrl, fullName } = await DbService.getData(
        'Users',
        post.uid
      );
      post.avatarUrl = avatarUrl;
      post.fullName = fullName;
    }
    return postsArr;
  },

  async likePost(uid, postId, ownerPost) {
    await DbService.updateDataInArray(
      'Posts',
      ownerPost,
      `post${postId}.likes`,
      uid
    );
    return;
  },
};

export default PostsService;
