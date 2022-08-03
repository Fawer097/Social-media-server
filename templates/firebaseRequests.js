import { db, auth } from '../firebase/firebaseInit.js';

export const createUser = (data) => {
  return auth.createUser({
    email: data.email,
    password: data.confirmPassword,
    displayName: `${data.firstName} ${data.lastName}`,
  });
};

export const setDataInDatabase = (collName, docName, data) =>
  db.collection(collName).doc(docName).set(data);

export const getDataInDatabase = (collName, docName) =>
  db.collection(collName).doc(docName).get();
