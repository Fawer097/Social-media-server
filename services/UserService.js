import { db } from '../firebase/firebaseInit.js';
import { userDataValidation } from '../validation/validation.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import TokenService from './TokenService.js';

class UserService {
  async signUp(data) {
    const { error } = userDataValidation(data);
    if (error) {
      throw new Error(error.message);
    }

    if (data.createPassword !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const candidate = await db.collection('Users').doc(data.email).get();
    if (candidate.data()) {
      throw new Error('This user is already registered');
    }

    const hashPassword = bcrypt.hashSync(data.confirmPassword, 5);
    delete data.createPassword;
    delete data.confirmPassword;
    const userData = { ...data, uid: uuidv4(), password: hashPassword };

    await db.collection('Users').doc(data.email).set(userData);
  }

  async signIn(email, password) {
    const dbData = await db.collection('Users').doc(email).get();
    const userData = dbData.data();
    if (!userData) {
      throw new Error('This user is not found');
    }
    const hashPassword = userData.password;
    const validPassword = bcrypt.compareSync(password, hashPassword);
    if (!validPassword) {
      throw new Error('Invalid password');
    }
    delete userData.password;
    delete userData.refreshToken;
    const tokens = TokenService.generateTokens(userData);
    await TokenService.saveToken(email, tokens.refreshToken);
    return { ...tokens, userData };
  }

  async logout(email) {
    await TokenService.removeToken(email);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error('This user is not found');
    }
    const tokenData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    const userDbData = await db.collection('Users').doc(tokenData.email).get();
    const userData = userDbData.data();
    delete userData.password;
    delete userData.refreshToken;
    const tokens = TokenService.generateTokens(userData);
    await TokenService.saveToken(userData.email, tokens.refreshToken);
    return { ...tokens, userData };
  }
}

export default new UserService();
