import { FieldValue } from 'firebase-admin/firestore';
import dbService from './dbService.js';

const postsService = {
  async getPosts(uid) {
    const posts = await dbService.getData('Posts', uid);
    if (!posts) {
      return [];
    }
    return Object.values(posts);
  },

  async createPost(uid, data) {
    const postId = Date.now();
    await dbService.setData('Posts', uid, {
      [`post${postId}`]: {
        createdAt: FieldValue.serverTimestamp(),
        postId,
        uid,
        ...data,
        likes: [],
        comments: [],
      },
    });
    const posts = await this.getPosts(uid);
    return posts;
  },

  async updatePost(uid, data) {
    const { postId, message, imageUrl } = data;
    await dbService.setData('Posts', uid, {
      [`post${postId}`]: {
        message,
        imageUrl,
      },
    });
    const posts = await dbService.getData('Posts', uid);
    return posts[`post${postId}`];
  },

  async deletePost(uid, postId) {
    await dbService.deleteData('Posts', uid, `post${postId}`);
    const posts = await this.getPosts(uid);
    return posts;
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

    const posts = await this.getPosts(ownerPost);
    let postData;
    posts.forEach((post) => {
      if (post.postId == postId) {
        postData = post;
      }
    });
    return postData;
  },

  async deleteLikePost(uid, postId, ownerPost) {
    await dbService.removeDataInArray(
      'Posts',
      ownerPost,
      `post${postId}.likes`,
      uid
    );

    const posts = await this.getPosts(ownerPost);
    let postData;
    posts.forEach((post) => {
      if (post.postId == postId) {
        postData = post;
      }
    });
    return postData;
  },

  async getComments(uid, postId) {
    const posts = await dbService.getData('Posts', uid);
    let comments;
    Object.values(posts).forEach((post) => {
      if (post.postId == postId) {
        comments = post.comments;
      }
    });
    return comments;
  },

  async createComment(uid, data) {
    const { comment, postData } = data;
    await dbService.updateDataInArray(
      'Posts',
      postData.uid,
      `post${postData.postId}.comments`,
      {
        message: comment,
        senderUid: uid,
        commentId: Date.now(),
        createdAt: Date.now() / 1000,
      }
    );
    const comments = await this.getComments(postData.uid, postData.postId);
    return comments;
  },

  async updateComment(uid, data) {
    const { postId, ownerUid, commentId, message } = data;
    const doc = await dbService.getData('Posts', ownerUid);
    let { comments } = doc[`post${postId}`];
    comments = comments.map((comment) => {
      if (comment.commentId === commentId) {
        return { ...comment, message };
      }
      return comment;
    });

    await dbService.setData('Posts', ownerUid, {
      [`post${postId}`]: {
        comments,
      },
    });
    const newComments = await this.getComments(ownerUid, postId);
    let newComment;
    newComments.forEach((comment) => {
      if (comment.commentId === commentId) {
        newComment = comment;
        return;
      }
    });
    return newComment;
  },

  async deleteComment(data) {
    const { commentId, postId, senderUid } = data;
    const doc = await dbService.getData('Posts', senderUid);
    const { comments } = doc[`post${postId}`];
    const filterComments = comments.filter(
      (comment) => comment.commentId !== commentId
    );
    await dbService.setData('Posts', senderUid, {
      [`post${postId}`]: {
        comments: filterComments,
      },
    });
    const newCommentsArr = await this.getComments(senderUid, postId);
    return newCommentsArr;
  },
};

export default postsService;
