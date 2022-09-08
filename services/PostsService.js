import { FieldValue } from 'firebase-admin/firestore';
import DbService from './DbService.js';

const PostsService = {
  async createPost(uid, data) {
    const { avatarUrl, fullName } = await DbService.getData('Users', uid);
    await DbService.setData('Posts', uid, {
      [Date.now()]: {
        createdAt: FieldValue.serverTimestamp(),
        fullName,
        avatarUrl,
        uid,
        ...data,
        likes: 0,
        comments: 0,
      },
    });
    return;
  },

  async getPosts(uid) {
    const posts = await DbService.getData('Posts', uid);
    return Object.values(posts);
  },
};

export default PostsService;
