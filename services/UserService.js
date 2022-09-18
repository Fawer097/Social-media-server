import bcrypt from 'bcrypt';
import dbService from './dbService.js';
import dtoService from './dtoService.js';

const userService = {
  async updateUserData(uid, data) {
    if (data.firstName && data.lastName) {
      await dbService.setData('Users', uid, {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
      });
    } else {
      await dbService.setData('Users', uid, {
        ...data,
      });
    }
    const userData = await dbService.getData('Users', uid);
    return dtoService.userDto(userData);
  },

  async updatePassword(uid, password) {
    const hashPassword = bcrypt.hashSync(password, 5);
    return await this.updateUserData(uid, { password: hashPassword });
  },

  async searchUsers(query) {
    const regexp = /\s+/g;
    const usersData = await dbService.getData('Users');
    const usersArr = [];
    usersData.forEach((user) => {
      usersArr.push(dtoService.userDto(user.data()));
    });
    const filterUsers = usersArr.filter((user) =>
      user.fullName
        .toLowerCase()
        .replace(regexp, '')
        .includes(query.toLowerCase().replace(regexp, ''))
    );
    return filterUsers;
  },

  async getOtherUserData(uid) {
    const userData = await dbService.getData('Users', uid);
    return dtoService.userDto(userData);
  },
};

export default userService;
