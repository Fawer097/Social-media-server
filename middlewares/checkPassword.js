import dbService from '../services/dbService.js';
import bcrypt from 'bcrypt';

export const checkPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const uid = req.headers.uid;
    const dbData = await dbService.getData('Users', uid);
    const hashPassword = dbData.password;
    const validPassword = bcrypt.compareSync(password, hashPassword);
    if (!validPassword) {
      throw new Error('Invalid password!');
    }
    return next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
