import UserService from '../services/UserService.js';

class UserController {
  async signUp(req, res, next) {
    try {
      await UserService.signUp(req.body);
      return res.json('User successfully created');
    } catch (error) {
      return res.status(401).json(error.message);
    }
  }

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
  }

  async logout(req, res, next) {
    try {
      const { email } = req.body;
      await UserService.logout(email);
      res.clearCookie('refreshToken');
      return res.status(200).end();
    } catch (error) {
      return res.status(401).json(error.message);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
      return res.json(userData);
    } catch (error) {
      return res.status(401).json(error.message);
    }
  }

  async userData(req, res, next) {
    try {
      return res.json(req.user);
    } catch (error) {
      return res.status(401).json(error.message);
    }
  }
}

export default new UserController();
