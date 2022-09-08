import { FieldValue } from 'firebase-admin/firestore';
import DbService from './DbService.js';
import DtoService from './DtoService.js';

const MessageService = {
  async setMessage(senderUid, receiverUid, message) {
    const { avatarUrl, fullName } = await DbService.getData('Users', senderUid);
    await DbService.setData('Chats', senderUid, {
      [receiverUid]: {
        [Date.now()]: {
          createdAt: FieldValue.serverTimestamp(),
          fullName,
          avatarUrl,
          senderUid,
          message,
        },
      },
    });
    await DbService.setData('Chats', receiverUid, {
      [senderUid]: {
        [Date.now()]: {
          createdAt: FieldValue.serverTimestamp(),
          fullName,
          avatarUrl,
          senderUid,
          message,
        },
      },
    });
    return;
  },

  async getChatsData(uid) {
    const chatsData = await DbService.getData('Chats', uid);
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
