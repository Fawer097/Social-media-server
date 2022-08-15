import { fieldValue } from '../firebase/firebaseInit.js';
import jwt from 'jsonwebtoken';
import { db } from '../firebase/firebaseInit.js';

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
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
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return tokenData;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const dbData = await db
      .collection('Users')
      .where('refreshToken', '==', refreshToken)
      .get();
    if (dbData.empty) {
      return null;
    }
    let token;
    dbData.forEach((data) => (token = data.data().refreshToken));
    return token;
  }

  async saveToken(email, refreshToken) {
    await db
      .collection('Users')
      .doc(email)
      .set({ refreshToken }, { merge: true });
  }

  async removeToken(email) {
    await db.collection('Users').doc(email).update({
      refreshToken: fieldValue.delete(),
    });
  }
}

export default new TokenService();
