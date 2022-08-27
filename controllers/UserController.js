import DataService from '../services/DataService.js';
import DbService from '../services/DbService.js';
import UserService from '../services/UserService.js';

const UserController = {
  async signUp(req, res, next) {
    try {
      await UserService.signUp(req.body);
      return res.status(201).json();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async signIn(req, res, next) {
    try {
      const uid = req.headers.uid;
      const userData = await UserService.signIn(uid);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
      return res.json(userData);
    } catch (error) {
      return res.status(401).json(error.message);
    }
  },

  async logout(req, res, next) {
    try {
      const { uid } = req.body;
      await UserService.logout(uid);
      res.clearCookie('refreshToken');
      return res.status(200).end();
    } catch (error) {
      return res.status(401).json(error.message);
    }
  },

  async verifyToken(req, res, next) {
    try {
      const uid = req.headers.uid;
      const dbData = await DbService.getData('Users', uid);
      return res.json(DataService.clientData(dbData));
    } catch (error) {
      return res.status(401).json(error.message);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const data = await UserService.refreshTokens(refreshToken);
      res.cookie('refreshToken', data.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
      return res.json(data);
    } catch (error) {
      return res.status(401).json(error.message);
    }
  },

  async updateUserData(req, res, next) {
    try {
      const uid = req.headers.uid;
      const userData = await UserService.updateUserData(uid, req.body);
      return res.json(userData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async updateAuthData(req, res, next) {
    try {
      const uid = req.headers.uid;
      const { email, newPassword } = req.body;
      if (email) {
        const userData = await UserService.updateUserData(uid, { email });
        return res.json(userData);
      }
      if (newPassword) {
        await UserService.updatePassword(uid, newPassword);
        return res.json('Password changed successfully.');
      }
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default UserController;
