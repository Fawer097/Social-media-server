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

    const candidate = await DbService.searchData(
      'Users',
      'email',
      '==',
      data.email
    );
    if (candidate) {
      throw new Error('This email address is already in use by another user.');
    }

    const hashPassword = bcrypt.hashSync(data.confirmPassword, 5);
    delete data.createPassword;
    delete data.confirmPassword;
    const dbData = { ...data, uid: uuidv4(), password: hashPassword };

    await DbService.setData('Users', dbData.uid, dbData);
    return;
  },

  async signIn(email, password) {
    const dbDataArr = await DbService.searchData('Users', 'email', '==', email);
    if (!dbDataArr) {
      throw new Error('This user is not found.');
    }
    const uid = dbDataArr[0].uid;
    const userData = await DbService.getData('Users', uid);
    const hashPassword = userData.password;
    const validPassword = bcrypt.compareSync(password, hashPassword);
    if (!validPassword) {
      throw new Error('Invalid password!');
    }
    const tokens = TokenService.generateTokens(DataService.tokenData(userData));
    await TokenService.saveToken(uid, tokens.refreshToken);
    return { ...tokens, userData: DataService.clientData(userData) };
  },

  async logout(uid) {
    await TokenService.removeToken(uid);
    return;
  },

  async refreshTokens(refreshToken) {
    if (!refreshToken) {
      throw new Error('This user is not found.');
    }
    const tokenData = TokenService.validateRefreshToken(refreshToken);
    const userData = await DbService.getData('Users', tokenData.uid);
    const tokens = TokenService.generateTokens(DataService.tokenData(userData));
    await TokenService.saveToken(userData.uid, tokens.refreshToken);
    return { tokens, userData: DataService.clientData(userData) };
  },

  async updateUserData(uid, data) {
    await DbService.setData('Users', uid, data);
    const userData = await DbService.getData('Users', uid);
    return DataService.clientData(userData);
  },
};

export default UserService;
