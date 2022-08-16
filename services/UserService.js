import { userDataValidation } from '../validation/validation.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import TokenService from './TokenService.js';
import DbService from './DbService.js';
import DataService from './DataService.js';

class UserService {
  async signUp(data) {
    const { error } = userDataValidation(data);
    if (error) {
      throw new Error(error.message);
    }

    if (data.createPassword !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const candidate = await DbService.getData('Users', data.email);
    if (candidate) {
      throw new Error('This user is already registered');
    }

    const hashPassword = bcrypt.hashSync(data.confirmPassword, 5);
    delete data.createPassword;
    delete data.confirmPassword;
    const dataForDb = { ...data, uid: uuidv4(), password: hashPassword };

    await DbService.setData('Users', data.email, dataForDb);
  }

  async signIn(email, password) {
    const userData = await DbService.getData('Users', email);
    if (!userData) {
      throw new Error('This user is not found');
    }
    const hashPassword = userData.password;
    const validPassword = bcrypt.compareSync(password, hashPassword);
    if (!validPassword) {
      throw new Error('Invalid password');
    }
    const tokens = TokenService.generateTokens(DataService.tokenData(userData));
    await TokenService.saveToken(email, tokens.refreshToken);
    return { ...tokens, userData: DataService.clientData(userData) };
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
    const userData = await DbService.getData('Users', tokenData.email);
    const tokens = TokenService.generateTokens(DataService.tokenData(userData));
    await TokenService.saveToken(userData.email, tokens.refreshToken);
    return tokens;
  }
}

export default new UserService();
