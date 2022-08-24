import UserService from '../services/UserService.js';

const UserController = {
  async signUp(req, res, next) {
    try {
      await UserService.signUp(req.body);
      return res.status(201).json('User successfully created');
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.signIn(email, password);
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
      return res.json(req.userData);
    } catch (error) {
      return res.status(401).json(error.message);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const tokens = await UserService.refreshTokens(refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
      return res.json(tokens);
    } catch (error) {
      return res.status(401).json(error.message);
    }
  },

  async updateUserData(req, res, next) {
    try {
      const { uid } = req.userData;
      const userData = await UserService.updateUserData(uid, req.body);
      return res.json(userData);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

export default UserController;
