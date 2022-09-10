import authService from '../services/authService.js';
import dtoService from '../services/dtoService.js';
import dbService from '../services/dbService.js';

const authController = {
  async signUp(req, res, next) {
    try {
      await authService.signUp(req.body);
      return res.status(201).end();
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async signIn(req, res, next) {
    try {
      const { uid } = req.headers;
      const userData = await authService.signIn(uid);
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
      await authService.logout(uid);
      res.clearCookie('refreshToken');
      return res.status(200).end();
    } catch (error) {
      return res.status(401).json(error.message);
    }
  },

  async verifyToken(req, res, next) {
    try {
      const { uid } = req.headers;
      const dbData = await dbService.getData('Users', uid);
      return res.json(dtoService.userDto(dbData));
    } catch (error) {
      return res.status(401).json(error.message);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const data = await authService.refreshTokens(refreshToken);
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
};

export default authController;
