import dbService from './dbService.js';
import { v4 as uuidv4 } from 'uuid';
import tokenService from './tokenService.js';
import { userDataValidation } from '../validation/validation.js';
import dtoService from './dtoService.js';
import bcrypt from 'bcrypt';

const authService = {
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
    const dbData = {
      ...data,
      uid: uuidv4(),
      fullName: `${data.firstName} ${data.lastName}`,
      avatarUrl: '',
      password: hashPassword,
    };

    await dbService.setData('Users', dbData.uid, dbData);
    await dbService.setData('Friends', dbData.uid, {
      friends: [],
      outgoingRequests: [],
      incomingRequests: [],
    });
    return;
  },

  async signIn(uid) {
    const dbData = await dbService.getData('Users', uid);
    const tokens = tokenService.generateTokens({ uid: dbData.uid });
    await tokenService.saveToken(uid, tokens.refreshToken);
    return { ...tokens, userData: dtoService.userDto(dbData) };
  },

  async logout(uid) {
    await tokenService.removeToken(uid);
    return;
  },

  async refreshTokens(refreshToken) {
    if (!refreshToken) {
      throw new Error('This user is not found.');
    }
    const { uid } = tokenService.validateRefreshToken(refreshToken);
    const userData = await dbService.getData('Users', uid);
    const tokens = tokenService.generateTokens({ uid: userData.uid });
    await tokenService.saveToken(userData.uid, tokens.refreshToken);
    return { tokens, userData: dtoService.userDto(userData) };
  },
};

export default authService;
