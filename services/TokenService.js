import jwt from 'jsonwebtoken';
import DbService from './DbService.js';

const TokenService = {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  },

  validateAccessToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return tokenData;
    } catch (error) {
      throw new Error('This user is not found.');
    }
  },

  validateRefreshToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return tokenData;
    } catch (error) {
      throw new Error('This user is not found.');
    }
  },

  async saveToken(uid, refreshToken) {
    await DbService.setData('Users', uid, { refreshToken });
    return;
  },

  async removeToken(uid) {
    await DbService.deleteData('Users', uid, 'refreshToken');
    return;
  },
};

export default TokenService;
