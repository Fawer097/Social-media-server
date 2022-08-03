import { Router } from 'express';
import {
  createUser,
  setDataInDatabase,
} from '../templates/firebaseRequests.js';

const router = Router();

router.post('/api/signUp', (req, res) => {
  const data = req.body;
  createUser(data)
    .then((responseData) => {
      delete data.confirmPassword;
      setDataInDatabase('users', `user_${responseData.uid}`, {
        ...data,
        id: responseData.uid,
      })
        .then(res.json({ message: 'User has been created' }))
        .catch((error) => res.json({ message: error.message }));
    })
    .catch((error) => res.json({ message: error.message }));
});

export default router;
