// import * as CONSTANTS from '../utils/GlobaleStaticVars';

// export const sendTextMessage = (message, queuedMessage) => {
//   message.received = false;
//   message.status = CONSTANTS.MESSAGE_STATUS_UNREAD;
//   message.type = CONSTANTS.MESSAGE_TYPE_TEXT;
//   //   var userChatRef = onlineDB
//   //     .getReceiverChatRef(message.uidTo, message.uidFrom)
//   //     .push();
//   //   userChatRef.set({
//   //     _id: message._id,
//   //     text: message.text,
//   //     createdAt: message.createdAt.getTime(),
//   //     status: CONSTANTS.MESSAGE_STATUS_UNREAD,
//   //     type: message.type,
//   //     received: message.received,
//   //   });

//   //message.key = userChatRef.key;
//   message.sent = true;
//   if (queuedMessage === true) {
//     updateMessage(message);
//     localDB.deleteQueueMessage(message.id);
//   } else {
//     saveMessage(message);
//   }
// };
