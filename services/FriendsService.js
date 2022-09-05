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
    if (dbData && dbData.incomingRequests) {
      await DbService.updateDataInArray(
        'Friends',
        receiverUid,
        'incomingRequests',
        senderUid
      );
      return;
    }
    await DbService.setData('Friends', receiverUid, {
      friends: [],
      outgoingRequests: [],
      incomingRequests: [senderUid],
    });
    return;
  },

  async setOutgoingRequests(senderUid, receiverUid) {
    const dbData = await DbService.getData('Friends', senderUid);
    if (dbData && dbData.outgoingRequests) {
      await DbService.updateDataInArray(
        'Friends',
        senderUid,
        'outgoingRequests',
        receiverUid
      );
      return;
    }
    await DbService.setData('Friends', senderUid, {
      friends: [],
      incomingRequests: [],
      outgoingRequests: [receiverUid],
    });
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
    const { incomingRequests, friends } = await DbService.getData(
      'Friends',
      uid
    );
    const candidatesData = [];
    const friendsData = [];
    for (let uid of incomingRequests) {
      const candidateData = await DbService.getData('Users', uid);
      candidatesData.push(DtoService.friendDto(candidateData));
    }
    for (let uid of friends) {
      const friendData = await DbService.getData('Users', uid);
      friendsData.push(DtoService.friendDto(friendData));
    }
    return { candidatesData, friendsData };
  },
};

export default FriendsService;
