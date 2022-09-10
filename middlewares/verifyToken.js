import tokenService from '../services/tokenService.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error('User not authorized.');
    }
    const accessToken = authorization.split(' ')[1];
    if (!accessToken) {
      throw new Error('User not authorized.');
    }
    const { uid } = tokenService.validateAccessToken(accessToken);
    req.headers.uid = uid;
    return next();
  } catch (error) {
    return res.status(401).json(error.message);
  }
};
