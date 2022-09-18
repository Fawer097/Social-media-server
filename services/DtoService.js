const dtoService = {
  userDto(data) {
    delete data.password;
    delete data.refreshToken;
    return data;
  },

  userCardDto(data) {
    const { fullName, avatarUrl, uid, city, country, gender } = data;
    return { fullName, avatarUrl, uid, city, country, gender };
  },
};

export default dtoService;
