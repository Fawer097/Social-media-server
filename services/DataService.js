class DataService {
  clientData(data) {
    delete data.password;
    delete data.refreshToken;
    return data;
  }

  tokenData(data) {
    const { email, uid } = data;
    return { email, uid };
  }
}

export default new DataService();
