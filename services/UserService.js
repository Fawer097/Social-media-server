import { userDataValidation } from '../validation/validation.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import TokenService from './TokenService.js';
import DbService from './DbService.js';
import DataService from './DataService.js';

const UserService = {
  async signUp(data) {
    const { error } = userDataValidation(data);
    if (error) {
      throw new Error(error.message);
    }

    if (data.createPassword !== data.confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const hashPassword = bcrypt.hashSync(data.confirmPassword, 5);
    delete data.createPassword;
    delete data.confirmPassword;
    const dbData = { ...data, uid: uuidv4(), password: hashPassword };

    await DbService.setData('Users', dbData.uid, dbData);
    return;
  },

  async signIn(uid) {
    const dbData = await DbService.getData('Users', uid);
    const tokens = TokenService.generateTokens({ uid: dbData.uid });
    await TokenService.saveToken(uid, tokens.refreshToken);
    return { ...tokens, userData: DataService.clientData(dbData) };
  },

  async logout(uid) {
    await TokenService.removeToken(uid);
    return;
  },

  async refreshTokens(refreshToken) {
    if (!refreshToken) {
      throw new Error('This user is not found.');
    }
    const { uid } = TokenService.validateRefreshToken(refreshToken);
    const userData = await DbService.getData('Users', uid);
    const tokens = TokenService.generateTokens({ uid: userData.uid });
    await TokenService.saveToken(userData.uid, tokens.refreshToken);
    return { tokens, userData: DataService.clientData(userData) };
  },

  async updateUserData(uid, data) {
    await DbService.setData('Users', uid, data);
    const userData = await DbService.getData('Users', uid);
    return DataService.clientData(userData);
  },

  async updatePassword(uid, password) {
    const hashPassword = bcrypt.hashSync(password, 5);
    return await this.updateUserData(uid, { password: hashPassword });
  },
};

export default UserService;
