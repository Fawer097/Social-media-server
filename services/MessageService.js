import DbService from './DbService.js';
import { fieldValue } from '../firebase/firebaseInit.js';
import DtoService from './DtoService.js';

const MessageService = {
  async setMessage(senderUid, receiverUid, message) {
    const { avatarUrl, fullName, uid } = await DbService.getData(
      'Users',
      senderUid
    );
    await DbService.setData('Chats', senderUid, {
      [receiverUid]: {
        [Date.now()]: {
          createdAt: fieldValue.serverTimestamp(),
          fullName,
          avatarUrl,
          uid,
          message,
        },
      },
    });
    await DbService.setData('Chats', receiverUid, {
      [senderUid]: {
        [Date.now()]: {
          createdAt: fieldValue.serverTimestamp(),
          fullName,
          avatarUrl,
          uid,
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
