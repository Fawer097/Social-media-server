import { FieldValue } from 'firebase-admin/firestore';
import DbService from './DbService.js';
import DtoService from './DtoService.js';

const MessageService = {
  async setMessage(senderUid, receiverUid, message) {
    await DbService.setData('Chats', senderUid, {
      [receiverUid]: {
        [`message${Date.now()}`]: {
          createdAt: FieldValue.serverTimestamp(),
          senderUid,
          message,
        },
      },
    });
    await DbService.setData('Chats', receiverUid, {
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
    const chatsData = await DbService.getData('Chats', uid);
    if (!chatsData) {
      return [];
    }
    const interlocutorsUid = Object.keys(chatsData);
    const chatsDataArr = [];
    for (let uid of interlocutorsUid) {
      const userData = await DbService.getData('Users', uid);
      chatsDataArr.push(DtoService.userCardDto(userData));
    }
    return chatsDataArr;
  },
};

export default MessageService;
