import { Router } from 'express';
import { getDataInDatabase } from '../templates/firebaseRequests.js';

const router = Router();

router.post('/api/firestore', (req, res) => {
  getDataInDatabase('users', `user_${req.body.uid}`)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});

export default router;
