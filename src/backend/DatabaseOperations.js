const onSendMessage = (messageDetails, realm) => {
  realm.write(() => {
    let quotedMessage;
    let paresdObj;

    if (messageDetails?.quotedMessage?._id) {
      quotedMessage = realm.objectForPrimaryKey(
        'Message',
        messageDetails.quotedMessage._id,
      );
      let stringifiedObj = JSON.stringify(quotedMessage);
      paresdObj = JSON.parse(stringifiedObj);
    }

    if (quotedMessage) {
      const obj = {
        ...messageDetails,
        chatId: '',
        quotedMessage: paresdObj,
      };

      realm.create('Message', obj);
    } else {
      realm.create('Message', {
        ...messageDetails,
      });
    }
  });
};

const onUpdateMessage = (messageDetails, realm) => {
  realm.write(() => {
    // Check if the message already exists
    const existingMessage = realm.objectForPrimaryKey(
      'Message',
      messageDetails.id,
    );

    if (
      existingMessage &&
      messageDetails.type !== 'image' &&
      messageDetails.type !== 'video' &&
      messageDetails.type !== 'audio' &&
      messageDetails.type !== 'doc'
    ) {
      // Update the existing message
      Object.assign(existingMessage, {
        ...messageDetails,
        message: existingMessage.message,
        quotedMessage: existingMessage.quotedMessage,
        // createdAt: existingMessage.createdAt,
        // updatedAt: existingMessage.updatedAt,
        // messageTime: existingMessage.messageTime,

        chatId: '',
      });
    } else if (
      (existingMessage && messageDetails.type === 'image') ||
      messageDetails.type === 'video'
    ) {
      Object.assign(existingMessage, {
        ...messageDetails,
        message: existingMessage.message,
        thumbnailImage: existingMessage.thumbnailImage,
        quotedMessage: existingMessage.quotedMessage,

        chatId: '',
      });
    } else if (
      (existingMessage && messageDetails.type === 'audio') ||
      messageDetails.type === 'doc' ||
      messageDetails.type === 'gif'
    ) {
      Object.assign(existingMessage, {
        ...messageDetails,
        //message: existingMessage.message,
        quotedMessage: existingMessage.quotedMessage,

        chatId: '',
      });
    } else {
      // Create a new message
      realm.create('Message', {
        ...messageDetails,
        chatId: '',
      });
    }
  });
};

const onUpdateMessage2 = (messageDetails, existingMessage, realm) => {
  realm.write(() => {
    // Check if the message already exists

    if (
      existingMessage &&
      messageDetails.type !== 'image' &&
      messageDetails.type !== 'video' &&
      messageDetails.type !== 'audio' &&
      messageDetails.type !== 'doc'
    ) {
      // Update the existing message
      Object.assign(existingMessage, {
        ...messageDetails,
        message: existingMessage.message,
        quotedMessage: existingMessage.quotedMessage,
        // createdAt: existingMessage.createdAt,
        // updatedAt: existingMessage.updatedAt,
        // messageTime: existingMessage.messageTime,

        chatId: '',
      });
    } else if (
      (existingMessage && messageDetails.type === 'image') ||
      messageDetails.type === 'video'
    ) {
      Object.assign(existingMessage, {
        ...messageDetails,
        message: existingMessage.message,
        thumbnailImage: existingMessage.thumbnailImage,
        quotedMessage: existingMessage.quotedMessage,

        chatId: '',
      });
    } else if (
      (existingMessage && messageDetails.type === 'audio') ||
      messageDetails.type === 'doc' ||
      messageDetails.type === 'gif'
    ) {
      Object.assign(existingMessage, {
        ...messageDetails,
        //message: existingMessage.message,
        quotedMessage: existingMessage.quotedMessage,

        chatId: '',
      });
    } else {
      // Create a new message
      realm.create('Message', {
        ...messageDetails,
        chatId: '',
      });
    }
  });
};

export {onSendMessage, onUpdateMessage, onUpdateMessage2};
