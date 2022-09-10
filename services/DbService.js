import { db } from '../firebase/firebaseInit.js';
import { FieldValue } from 'firebase-admin/firestore';

const dbService = {
  async setData(coll, doc, data) {
    await db.collection(coll).doc(doc).set(data, { merge: true });
    return;
  },

  async getData(coll, doc) {
    if (doc) {
      const data = await db.collection(coll).doc(doc).get();
      return data.data();
    }
    const data = await db.collection(coll).get();
    return data;
  },

  async searchData(coll, key, operator, value) {
    const data = await db.collection(coll).where(key, operator, value).get();
    if (data.empty) {
      return null;
    }
    const result = [];
    data.forEach((data) => {
      result.push(data.data());
    });
    return result;
  },

  async deleteData(coll, doc, key) {
    await db
      .collection(coll)
      .doc(doc)
      .update({
        [key]: FieldValue.delete(),
      });
    return;
  },

  async updateDataInArray(coll, doc, key, data) {
    await db
      .collection(coll)
      .doc(doc)
      .update({
        [key]: FieldValue.arrayUnion(data),
      });
    return;
  },

  async removeDataInArray(coll, doc, key, data) {
    await db
      .collection(coll)
      .doc(doc)
      .update({
        [key]: FieldValue.arrayRemove(data),
      });
    return;
  },
};

export default dbService;
