const DataService = {
  clientData(data) {
    delete data.password;
    delete data.refreshToken;
    return data;
  },
};

export default DataService;
