import dbService from './dbService.js';
import dtoService from './dtoService.js';

const friendsService = {
  async checkFriends(senderUid, receiverUid) {
    const sender = await dbService.getData('Friends', senderUid);
    const receiver = await dbService.getData('Friends', receiverUid);
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
    await dbService.updateDataInArray(
      'Friends',
      receiverUid,
      'incomingRequests',
      senderUid
    );
    return;
  },

  async setOutgoingRequests(senderUid, receiverUid) {
    await dbService.updateDataInArray(
      'Friends',
      senderUid,
      'outgoingRequests',
      receiverUid
    );
    return;
  },

  async removeOutgoingRequest(senderUid, receiverUid) {
    await dbService.removeDataInArray(
      'Friends',
      receiverUid,
      'incomingRequests',
      senderUid
    );

    await dbService.removeDataInArray(
      'Friends',
      senderUid,
      'outgoingRequests',
      receiverUid
    );
    return;
  },

  async removeIncomingRequest(senderUid, receiverUid) {
    await dbService.removeDataInArray(
      'Friends',
      senderUid,
      'incomingRequests',
      receiverUid
    );

    await dbService.removeDataInArray(
      'Friends',
      receiverUid,
      'outgoingRequests',
      senderUid
    );
    return;
  },

  async setFriend(senderUid, receiverUid) {
    await dbService.removeDataInArray(
      'Friends',
      senderUid,
      'incomingRequests',
      receiverUid
    );

    await dbService.removeDataInArray(
      'Friends',
      senderUid,
      'outgoingRequests',
      receiverUid
    );

    await dbService.removeDataInArray(
      'Friends',
      receiverUid,
      'incomingRequests',
      senderUid
    );

    await dbService.removeDataInArray(
      'Friends',
      receiverUid,
      'outgoingRequests',
      senderUid
    );

    await dbService.updateDataInArray(
      'Friends',
      senderUid,
      'friends',
      receiverUid
    );

    await dbService.updateDataInArray(
      'Friends',
      receiverUid,
      'friends',
      senderUid
    );
    return;
  },

  async removeFriend(senderUid, receiverUid) {
    await dbService.removeDataInArray(
      'Friends',
      senderUid,
      'friends',
      receiverUid
    );

    await dbService.removeDataInArray(
      'Friends',
      receiverUid,
      'friends',
      senderUid
    );

    await this.setIncomingRequests(receiverUid, senderUid);
    await this.setOutgoingRequests(receiverUid, senderUid);
    return;
  },

  async getFriendsData(uid) {
    const { friends } = await dbService.getData('Friends', uid);
    const friendsDataArr = [];
    for (let uid of friends) {
      const userData = await dbService.getData('Users', uid);
      friendsDataArr.push(dtoService.userCardDto(userData));
    }
    return friendsDataArr;
  },

  async getCandidatesData(uid) {
    const { incomingRequests } = await dbService.getData('Friends', uid);
    const candidatesData = [];
    for (let uid of incomingRequests) {
      const userData = await dbService.getData('Users', uid);
      candidatesData.push(dtoService.userCardDto(userData));
    }
    return candidatesData;
  },

  async getOutgoingCandidatesData(uid) {
    const { outgoingRequests } = await dbService.getData('Friends', uid);
    const candidatesData = [];
    for (let uid of outgoingRequests) {
      const userData = await dbService.getData('Users', uid);
      candidatesData.push(dtoService.userCardDto(userData));
    }
    return candidatesData;
  },
};

export default friendsService;
