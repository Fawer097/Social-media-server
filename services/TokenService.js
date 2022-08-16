import jwt from 'jsonwebtoken';
import DbService from './DbService.js';

class TokenService {
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
  }

  validateAccessToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return tokenData;
    } catch (error) {
      throw new Error('This user is not found');
    }
  }

  validateRefreshToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return tokenData;
    } catch (error) {
      throw new Error('This user is not found');
    }
  }

  async findToken(refreshToken) {
    const data = await DbService.searchData(
      'Users',
      'refreshToken',
      '==',
      refreshToken
    );
    if (!data) {
      return null;
    }
    const token = data[0];
    return token;
  }

  async saveToken(email, refreshToken) {
    await DbService.setData('Users', email, { refreshToken });
    return;
  }

  async removeToken(email) {
    await DbService.deleteData('Users', email, 'refreshToken');
    return;
  }
}

export default new TokenService();
