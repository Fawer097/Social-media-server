import { initializeApp, cert } from 'firebase-admin/app';
import serviceAccount from './firebaseKey.json' assert { type: 'json' };
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
