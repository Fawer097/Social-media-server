import DataService from '../services/DataService.js';
import DbService from '../services/DbService.js';
import TokenService from '../services/TokenService.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error('User not authorized');
    }
    const accessToken = authorization.split(' ')[1];
    if (!accessToken) {
      throw new Error('User not authorized');
    }
    const tokenData = TokenService.validateAccessToken(accessToken);
    const userData = await DbService.getData('Users', tokenData.uid);
    req.userData = DataService.clientData(userData);
    next();
  } catch (error) {
    return res.status(401).json(error.message);
  }
};
