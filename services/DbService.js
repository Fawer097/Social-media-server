import { db, fieldValue } from '../firebase/firebaseInit.js';

const DbService = {
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
    let result = [];
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
        [key]: fieldValue.delete(),
      });
    return;
  },

  async updateDataInArray(coll, doc, key, data) {
    await db
      .collection(coll)
      .doc(doc)
      .update({
        [key]: fieldValue.arrayUnion(data),
      });
    return;
  },
};

export default DbService;
