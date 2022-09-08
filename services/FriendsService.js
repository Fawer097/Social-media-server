import DbService from './DbService.js';
import DtoService from './DtoService.js';

const FriendsService = {
  async checkFriends(senderUid, receiverUid) {
    const sender = await DbService.getData('Friends', senderUid);
    const receiver = await DbService.getData('Friends', receiverUid);
    if (
      sender &&
      receiver &&
      sender.incomingRequests.includes(receiverUid) &&
      sender.outgoingRequests.includes(receiverUid) &&
      receiver.incomingRequests.includes(senderUid) &&
      receiver.outgoingRequests.includes(senderUid)
    ) {
      return true;
    }
    return false;
  },

  async setIncomingRequests(senderUid, receiverUid) {
    const dbData = await DbService.getData('Friends', receiverUid);
    await DbService.updateDataInArray(
      'Friends',
      receiverUid,
      'incomingRequests',
      senderUid
    );
    return;
  },

  async setOutgoingRequests(senderUid, receiverUid) {
    const dbData = await DbService.getData('Friends', senderUid);
    await DbService.updateDataInArray(
      'Friends',
      senderUid,
      'outgoingRequests',
      receiverUid
    );
    return;
  },

  async setFriends(senderUid, receiverUid) {
    await DbService.removeDataInArray(
      'Friends',
      senderUid,
      'incomingRequests',
      receiverUid
    );

    await DbService.removeDataInArray(
      'Friends',
      senderUid,
      'outgoingRequests',
      receiverUid
    );

    await DbService.removeDataInArray(
      'Friends',
      receiverUid,
      'incomingRequests',
      senderUid
    );

    await DbService.removeDataInArray(
      'Friends',
      receiverUid,
      'outgoingRequests',
      senderUid
    );

    await DbService.updateDataInArray(
      'Friends',
      senderUid,
      'friends',
      receiverUid
    );

    await DbService.updateDataInArray(
      'Friends',
      receiverUid,
      'friends',
      senderUid
    );
    return;
  },

  async getFriendsData(uid) {
    const { friends } = await DbService.getData('Friends', uid);
    const friendsDataArr = [];
    for (let uid of friends) {
      const userData = await DbService.getData('Users', uid);
      friendsDataArr.push(DtoService.userCardDto(userData));
    }
    return friendsDataArr;
  },

  async getCandidatesData(uid) {
    const { incomingRequests } = await DbService.getData('Friends', uid);
    const candidatesData = [];
    for (let uid of incomingRequests) {
      const userData = await DbService.getData('Users', uid);
      candidatesData.push(DtoService.userCardDto(userData));
    }
    return candidatesData;
  },
};

export default FriendsService;