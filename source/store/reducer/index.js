import { createSlice } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import {
  CHAT_TYPE,
  CONTENT_TYPE,
  MESSAGE_STATUS,
  USER_STATUS,
} from "../../constant";

// reducers/someReducer.js
const initialState = {
  unread: 0,
  archive: 0,
  data: {},
  opens:
    Platform.OS == "web" ? JSON.parse(localStorage.getItem("opens")) || [] : [],
  users: {},
};

/* Structure of Chat data = {
  unread:<number>
  archive:<number>
  more = <boolean>,
  data ={
    <chatId> :{
      ""...Chat INFO""
      messages:{
        data: {
          messageid: {""Message INfo""}
        }
        more : <boolean>,
        option:{}
      },
      options:{
        scrollMessage: <string>
      }
    }
  }
  opens:[] // strings of open chat id
  users:{
    <userId>:{""user info""} // keep online users 
  }  
 } */

const reducer = {
  // Adding Chat data ..
  add: (state, action) => {
    try {
      const { count, more, chats } = action.payload;
      if (more !== undefined) state.more = more;
      count && (state.count = count);
      chats.forEach((eachChat) => {
        state.data[eachChat.chat._id] = {
          ...state.data[eachChat.chat._id],
          ...eachChat,
        };
      });
    } catch (error) {
      console.log("error while adding user", error);
    }
  },

  //Handling new Chat Message tab open
  newChatOpen: (state, action) => {
    try {
      const { id, screen } = action.payload;
      // const index = state.opens.findIndex((ele) => ele.split("_")[0] == id);
      // if (index !== -1) {
      //   state.opens.splice(index, 1);
      // }
      // state.opens.unshift(`${id}_${screen}`);
      if (Platform.OS == "web") {
        const opened = state.opens[0];
        if (opened) {
          const id = opened.split("_")[0]
          const localPassword = JSON.parse(localStorage.getItem("passwords"));
          if (localPassword?.[id]) {
            delete localPassword[id];
            localStorage.setItem("passwords", JSON.stringify(localPassword))
          }
        }
      }
      state.opens = [`${id}_${screen}`];
      if (Platform.OS == "web")
        localStorage.setItem("opens", JSON.stringify(state.opens));
    } catch (error) {
      console.log("error while opening new chat", error);
    }
  },

  // Handle chat close
  chatClose: (state, action) => {
    if (!action.payload) state.opens.pop();
    else
      state.opens = state.opens.filter(
        (ele) => action.payload !== ele.split("_")[0]
      );
    if (Platform.OS == "web") {
      const localPassword = JSON.parse(localStorage.getItem("passwords"));
      if (localPassword?.[action.payload]) {
        delete localPassword[action.payload];
        localStorage.setItem("passwords", JSON.stringify(localPassword))
      }
      localStorage.setItem("opens", JSON.stringify(state.opens));
    }
  },

  clearOpens: (state, action) => {
    state.opens = [];
    if (Platform.OS == "web")
      localStorage.setItem("opens", JSON.stringify(state.opens));
  },

  chatNavigation: (state, action) => {
    try {
      const { id, screen, add } = action.payload;
      const index = state.opens.findIndex((ele) => ele.split("_")[0] == id);
      if (index !== -1) {
        state.opens[index] = add ? `${id}_${screen}_add` : `${id}_${screen}`;
        if (Platform.OS == "web")
          localStorage.setItem("opens", JSON.stringify(state.opens));
      }
    } catch (error) {
      console.log("Error while chat Navigation", error);
    }
  },

  // ADding messages to chat
  addMessage: (state, action) => {
    try {
      const { chatId, messages, more, USER_ID } = action.payload;
      const nextState = { ...state };
      nextState.data[chatId].messages ||= { more: false, data: {} };
      nextState.data[chatId].messages = {
        more: more,
        data: {
          ...state.data[chatId].messages.data,
          ...messages.reduce((acc, eachMessage) => {
            acc[eachMessage._id] = {
              ...eachMessage,
              fromMe: eachMessage.sender == USER_ID ? true : false,
            };
            return acc;
          }, {}),
        },
      };
      // Update the state with the new references
      state = nextState;
    } catch (error) {
      console.log("error while adding messages", error);
    }
  },

  // Handle New Socket Message
  newMessage: (state, action) => {
    try {
      const { chatId, message, fromMe } = action.payload;
      const chat = state.data[chatId];
      if (message.refId && chat.messages?.data)
        delete chat.messages.data[message.refId];
      if (chat && !fromMe) {
        switch (true) {
          case chat.unread == 0:
            state.unread++;
            chat.unread++;
            break;
          case chat.unread > 0:
            chat.unread++;
            break;
          case chat.unread == -1:
            chat.unread = 1;
        }
      }
      chat.lastMessage = message;
      chat.messages ||= { count: 0, data: {} };
      chat.messages.data[message._id] = { ...message, reactions: [] };
    } catch (error) {
      console.log("Error while handle new message", error);
    }
  },

  messageReceived: (state, action) => {
    try {
      const { chat: chatId, message, status } = action.payload;
      const chat = state.data[chatId];
      if (!chat) return;
      const chatLastMessage = chat.lastMessage;
      chatLastMessage._id === message &&
        chatLastMessage.message_status < status &&
        (chatLastMessage.message_status = status);
      const messageData = chat.messages.data[message];
      messageData &&
        messageData.message_status < status &&
        (messageData.message_status = status);
    } catch (error) {
      console.log("Error while updating message status", error);
    }
  },

  messageSeen: (state, action) => {
    try {
      const { chat: chatId, messages, status } = action.payload;
      const chat = state.data[chatId];
      if (!chat) return;
      messages.forEach((message) => {
        const chatLastMessage = chat.lastMessage;
        chatLastMessage._id === message &&
          chatLastMessage.message_status < status &&
          (chatLastMessage.message_status = status);
        const messageData = chat.messages?.data?.[message];
        messageData &&
          messageData.message_status < status &&
          (messageData.message_status = status);
      });
    } catch (error) {
      console.log("Error while udatin message seen status", error);
    }
  },

  addUser: (state, action) => {
    try {
      const { users } = action.payload;
      users.forEach((user) => {
        state.users[user._id] = { ...user, active: true };
      });
    } catch (error) {
      console.log("error while adding user", error);
    }
  },

  userStatus: (state, action) => {
    try {
      const user = action.payload;
      state.users[user._id] = user;
    } catch (error) {
      console.log("error while updating user");
    }
  },

  userAction: (state, actions) => {
    try {
      const { chat, action, status, user } = actions.payload;
      const chatInfo = state.data[chat];
      if (chatInfo) chatInfo.action = { [action]: status, user };
    } catch (error) {
      console.log("error while user action", error);
    }
  },

  chatReadCount: (state, action) => {
    try {
      const { chats, count } = action.payload;
      chats.forEach((chatId) => {
        const chat = state.data[chatId];
        if (count == 0) state.unread--;
        else if (count == -1) state.unread++;
        if (chat) chat.unread = count;
      });
    } catch (error) {
      console.log("Error while chat read ", error);
    }
  },

  chatPin: (state, action) => {
    try {
      const { chat: chatId, status, updatedAt } = action.payload;
      const chat = state.data[chatId];
      chat.pin = status;
      if (status) chat.pinAt = updatedAt;
      else delete chat.pinAt;
    } catch (error) {
      console.log("Error while chat Pin and unpin ", error);
    }
  },

  chatArchive: (state, action) => {
    try {
      const chat = action.payload.chat;
      state.data[chat].archive = action.payload.status;
    } catch (error) {
      console.log("error while chat archive", error);
    }
  },

  chatMute: (state, action) => {
    try {
      const chat = action.payload.chat;
      state.data[chat].mute = action.payload.status;
    } catch (error) {
      console.log("error while chat mute", error);
    }
  },

  archiveCount: (state, action) => {
    try {
      state.archive = action.payload;
    } catch (error) {
      console.log("error while handling archive count", error);
    }
  },

  messageOption: (state, action) => {
    try {
      const { chat, message } = action.payload;
      const chats = state.data[chat];
      chats.messages ||= {};
      chats.messages.option ||= {};
      chats.messages.option.message = message;
    } catch (error) {
      console.log("error while message option", error);
    }
  },

  messageReaction: (state, action) => {
    try {
      const {
        chat,
        createdAt,
        message,
        reaction,
        status,
        updatedAt,
        user,
        _id,
      } = action.payload;
      const reactions = state.data[chat].messages.data[message].reactions;
      const index = reactions.findIndex((reaction) => reaction._id == _id);
      if (status && index == -1)
        reactions.push({
          createdAt,
          message,
          reaction,
          status,
          updatedAt,
          user,
          _id,
        });
      else if (status && index !== -1)
        reactions.splice(index, 1, {
          createdAt,
          message,
          reaction,
          status,
          updatedAt,
          user,
          _id,
        });
      else if (!status) reactions.splice(index, 1);
    } catch (error) {
      console.log("error while handling message reaction", error);
    }
  },

  chatBlock: (state, action) => {
    try {
      const { chat, status } = action.payload;
      state.data[chat].blocked = status;
    } catch (error) {
      console.log("Error in chat block reducers", error);
    }
  },

  chatBlockMe: (state, action) => {
    try {
      const { chat, blocked } = action.payload;
      state.data[chat].blockedMe = blocked;
    } catch (error) {
      console.log("Error in chat block reducers");
    }
  },

  chatDeleted: (state, action) => {
    try {
      const { chat: chatId, group } = action.payload;
      const chat = state.data[chatId];
      if (
        chat.chat.chatType == CHAT_TYPE.group &&
        group &&
        group.member.status == USER_STATUS.active
      ) {
        const chat = state.data[chatId];
        delete chat.messages;
        chat.lastMessage = {
          ...chat.lastMessage,
          contentType: CONTENT_TYPE.hidden,
          message_status: null,
        };
        chat.unread = 0;
      } else {
        if (chat.archive) state.archive--;
        delete state.data[chatId];
      }
    } catch (error) {
      console.log("error while chat delete remove");
    }
  },

  messageDeletedEveryone: (state, action) => {
    try {
      const { chat, message, deletedBy } = action.payload;
      const chatDetails = state.data[chat];
      const deleted = {
        contentType: CONTENT_TYPE.deleted,
        deleted: true,
        text: "This message was deleted",
        message_status: MESSAGE_STATUS.deletedEveryone,
        deletedBy,
      };
      if (chatDetails.lastMessage._id == message)
        chatDetails.lastMessage = { ...chatDetails.lastMessage, ...deleted };
      if (chatDetails.messages.data?.[message])
        chatDetails.messages.data[message] = {
          ...state.data[chat].messages.data[message],
          ...deleted,
        };
    } catch (error) {
      console.log("error  >>>", error);
    }
  },

  messageDeleted: (state, action) => {
    try {
      const { chat, message } = action.payload;
      delete state.data[chat].messages.data[message];
    } catch (error) {
      console.log("message deleted error  >>>", error);
    }
  },

  messageSeenEventUpdate: (state, action) => {
    try {
      const { chat, messages } = action.payload;
      const chatData = state.data[chat];
      chatData.unread--;
      const messagesData = chatData.messages.data;
      messages.forEach((message) => {
        messagesData[message._id].new = false;
      });
    } catch (error) {
      console.log("error while message seen Event Update", error);
    }
  },

  chatOption: (state, action) => {
    try {
      const { chat, option } = action.payload;
      const chatData = state.data[chat];
      chatData.options ||= {};
      chatData.options = { ...chatData.options, ...option };
    } catch (error) {
      console.log("error while handling chat option", error);
    }
  },

  chatUnread: (state, action) => {
    state.unread = action.payload;
  },

  messageStarred: (state, action) => {
    const { chat, messages, status } = action.payload;
    const chatData = state.data[chat];
    messages.forEach((message) => {
      const messageData = chatData?.messages?.data?.[message];
      if (messageData) messageData.starred = status;
    });
  },

  chatPassword: (state, action) => {
    try {
      const { chat, password } = action.payload;
      if (password)
        state.data[chat].chat.password = password;
      else delete state.data[chat].chat.password;
    } catch (error) {
      console.log("error in chat password", error);
    }
  },

  deleteRefMessage: (state, action) => {
    const { chat: chatId, refId } = action.payload
    const chat = state.data[chatId];
    if (chat.messages?.data)
      delete chat.messages.data[refId];
  }
};

const chatsSlice = createSlice({
  name: "chats",
  initialState: initialState,
  reducers: reducer,
});

export const {
  add,
  newChatOpen,
  addMessage,
  chatClose,
  newMessage,
  messageReceived,
  messageSeen,
  addUser,
  userStatus,
  userAction,
  chatReadCount,
  chatNavigation,
  chatPin,
  chatArchive,
  chatMute,
  archiveCount,
  messageOption,
  messageReaction,
  chatBlock,
  chatBlockMe,
  chatDeleted,
  messageDeletedEveryone,
  messageDeleted,
  messageSeenEventUpdate,
  chatOption,
  chatUnread,
  messageStarred,
  clearOpens,
  chatPassword,
  deleteRefMessage
} = chatsSlice.actions;

export default chatsSlice.reducer;
