import dbService from '../services/dbService.js';

export const checkNonExistEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error('Fill in the email address!');
    }
    const candidate = await dbService.searchData('Users', 'email', '==', email);
    if (!candidate) {
      throw new Error('This user is not found.');
    }
    req.headers.uid = candidate[0].uid;
    return next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
