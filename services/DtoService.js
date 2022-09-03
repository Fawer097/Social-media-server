const DtoService = {
  userDto(data) {
    delete data.password;
    delete data.refreshToken;
    return data;
  },
};

export default DtoService;
