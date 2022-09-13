import { FieldValue } from 'firebase-admin/firestore';
import dbService from './dbService.js';
import dtoService from './dtoService.js';
import { db } from '../firebase/firebaseInit.js';

const messagerService = {
  async setMessage(senderUid, receiverUid, data) {
    const messageId = Date.now();
    await dbService.setData('Chats', senderUid, {
      [receiverUid]: {
        [`message${messageId}`]: {
          createdAt: FieldValue.serverTimestamp(),
          senderUid,
          receiverUid,
          messageId,
          ...data,
        },
      },
    });
    await dbService.setData('Chats', receiverUid, {
      [senderUid]: {
        [`message${messageId}`]: {
          createdAt: FieldValue.serverTimestamp(),
          senderUid,
          receiverUid,
          messageId,
          ...data,
        },
      },
    });
    return;
  },

  async deleteMessage(senderUid, receiverUid, messageId) {
    await db
      .collection('Chats')
      .doc(senderUid)
      .update({
        [`${receiverUid}.message${messageId}`]: FieldValue.delete(),
      });

    await db
      .collection('Chats')
      .doc(receiverUid)
      .update({ [`${senderUid}.message${messageId}`]: FieldValue.delete() });
    return;
  },

  async deleteChat(uid, interlocutor) {
    await dbService.deleteData('Chats', uid, interlocutor);
    return;
  },
};

export default messagerService;
