import { FieldValue } from 'firebase-admin/firestore';
import dbService from './dbService.js';
import dtoService from './dtoService.js';

const messagerService = {
  async setMessage(senderUid, receiverUid, message) {
    await dbService.setData('Chats', senderUid, {
      [receiverUid]: {
        [`message${Date.now()}`]: {
          createdAt: FieldValue.serverTimestamp(),
          senderUid,
          message,
        },
      },
    });
    await dbService.setData('Chats', receiverUid, {
      [senderUid]: {
        [`message${Date.now()}`]: {
          createdAt: FieldValue.serverTimestamp(),
          senderUid,
          message,
        },
      },
    });
    return;
  },

  async getChatsData(uid) {
    const chatsData = await dbService.getData('Chats', uid);
    if (!chatsData) {
      return [];
    }
    const interlocutorsUid = Object.keys(chatsData);
    const chatsDataArr = [];
    for (let uid of interlocutorsUid) {
      const userData = await dbService.getData('Users', uid);
      chatsDataArr.push(dtoService.userCardDto(userData));
    }
    return chatsDataArr;
  },
};

export default messagerService;
