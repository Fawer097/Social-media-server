import userService from '../services/userService.js';

const userController = {
  async updateUserData(req, res, next) {
    try {
      const { uid } = req.headers;
      const userData = await userService.updateUserData(uid, req.body);
      return res.json(userData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async updateAuthData(req, res, next) {
    try {
      const { uid } = req.headers;
      const { email, newPassword } = req.body;
      if (email) {
        const userData = await userService.updateUserData(uid, { email });
        return res.json(userData.email);
      }
      if (newPassword) {
        await userService.updatePassword(uid, newPassword);
        return res.json('Password changed successfully.');
      }
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async searchUsers(req, res, next) {
    try {
      const { q } = req.query;
      const users = await userService.searchUsers(q);
      return res.json(users);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async otherUserData(req, res, next) {
    try {
      const uid = req.headers.data;
      const userData = await userService.getOtherUserData(uid);
      return res.json(userData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default userController;
