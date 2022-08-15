import tokenService from '../services/tokenService.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error('User not authorized');
    }
    const accessToken = authorization.split(' ')[1];
    if (!accessToken) {
      throw new Error('User not authorized');
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      throw new Error('User not authorized');
    }
    req.user = userData;
    next();
  } catch (error) {
    throw new Error('User not authorized');
  }
};
