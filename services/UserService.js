import { userDataValidation } from '../validation/validation.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import TokenService from './TokenService.js';
import DbService from './DbService.js';
import DtoService from './DtoService.js';

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
    const dbData = {
      ...data,
      uid: uuidv4(),
      fullName: `${data.firstName} ${data.lastName}`,
      avatarUrl: '',
      password: hashPassword,
    };

    await DbService.setData('Users', dbData.uid, dbData);
    return;
  },

  async signIn(uid) {
    const dbData = await DbService.getData('Users', uid);
    const tokens = TokenService.generateTokens({ uid: dbData.uid });
    await TokenService.saveToken(uid, tokens.refreshToken);
    return { ...tokens, userData: DtoService.userDto(dbData) };
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
    return { tokens, userData: DtoService.userDto(userData) };
  },

  async updateUserData(uid, data) {
    if (data.firstName && data.lastName) {
      await DbService.setData('Users', uid, {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
      });
    } else {
      await DbService.setData('Users', uid, {
        ...data,
      });
    }
    const userData = await DbService.getData('Users', uid);
    return DtoService.userDto(userData);
  },

  async updatePassword(uid, password) {
    const hashPassword = bcrypt.hashSync(password, 5);
    return await this.updateUserData(uid, { password: hashPassword });
  },

  async searchUsers(query) {
    const usersData = await DbService.getData('Users');
    const usersArr = [];
    usersData.forEach((user) => {
      usersArr.push(DtoService.userDto(user.data()));
    });
    const filterUsers = usersArr.filter((user) =>
      user.fullName
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.toLowerCase().replace(/\s+/g, ''))
    );
    return filterUsers;
  },

  async getOneUserData(uid) {
    const userData = await DbService.searchData('Users', 'uid', '==', uid);
    return DtoService.userDto(userData[0]);
  },

  async friendsRequest(sendUid, acceptUid) {
    const dbData = await DbService.getData('Users', acceptUid);
    if (dbData.friendsCandidates && dbData.friendsCandidates.length) {
      await DbService.updateDataInArray(
        'Users',
        acceptUid,
        'friendsCandidates',
        sendUid
      );
      const { friendsCandidates } = await DbService.getData('Users', acceptUid);
      return friendsCandidates;
    }
    await DbService.setData('Users', acceptUid, {
      friendsCandidates: [sendUid],
    });
    const { friendsCandidates } = await DbService.getData('Users', acceptUid);
    return friendsCandidates;
  },
};

export default UserService;
