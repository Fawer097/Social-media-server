const DtoService = {
  userDto(data) {
    delete data.password;
    delete data.refreshToken;
    return data;
  },

  friendDto(data) {
    const { fullName, avatarUrl, uid, city, country } = data;
    return { fullName, avatarUrl, uid, city, country };
  },
};

export default DtoService;
