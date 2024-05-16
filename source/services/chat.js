import { LIMIT } from "../constant";
import axiosInstance from "../utils/axios";

export const fetchChats = async ({ archive, lastMessage, limit }) => {
  try {
    const config = {
      method: "GET",
      url: `/chat`,
      params: {
        archive: archive || false,
        lastMessage,
        limit: limit || LIMIT,
      },
    };
    const response = await axiosInstance(config);
    const { chats, count, more } = response.data;
    return { success: true, chats, more };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const fetchChat = async (chat) => {
  try {
    const response = await axiosInstance.get(`/chat/${chat}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const chatPin = async (chat) => {
  try {
    await axiosInstance.post("/chat/pin", { chat: chat });
    return { success: true };
  } catch (error) {
    console.log("error while pin chat", error);
    return { success: false, message: error.message };
  }
};

export const chatUnpin = async (chat) => {
  try {
    await axiosInstance.post("/chat/unpin", { chat: chat });
    return { success: true };
  } catch (error) {
    console.log("error while pin chat", error);
    return { success: false, message: error.message };
  }
};

export const chatArchive = async (chat) => {
  try {
    await axiosInstance.post("/chat/archive", { chat: chat });
    return { success: true };
  } catch (error) {
    console.log("error while pin chat", error);
    return { success: false, message: error.message };
  }
};

export const chatUnarchive = async (chat) => {
  try {
    await axiosInstance.post("/chat/unarchive", { chat: chat });
    return { success: true };
  } catch (error) {
    console.log("error while pin chat", error);
    return { success: false, message: error.message };
  }
};

export const chatMarkRead = async (data) => {
  try {
    await axiosInstance.post("/chat/mark-read", data);
    return { success: true };
  } catch (error) {
    console.log("error while mark read chat", error);
    return { success: false, message: error.message };
  }
};

export const chatMarkUnRead = async (data) => {
  try {
    await axiosInstance.post("/chat/mark-unread", data);
    return { success: true };
  } catch (error) {
    console.log("error while mark unread chat", error);
    return { success: false, message: error.message };
  }
};

export const chatUnmute = async (data) => {
  try {
    await axiosInstance.post("/chat/unmute", data);
    return { success: true };
  } catch (error) {
    console.log("error while mark unread chat", error);
    return { success: false, message: error.message };
  }
};

export const chatMute = async (data) => {
  try {
    await axiosInstance.post("/chat/mute", data);
    return { success: true };
  } catch (error) {
    console.log("error while mark unread chat", error);
    return { success: false, message: error.message };
  }
};

export const chatSearch = async (params) => {
  console.log("params", params);
  try {
    const config = {
      method: "GET",
      url: `/chat/search`,
      params: { ...params, limit: LIMIT },
    };
    const response = await axiosInstance(config);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const archiveChatCount = async () => {
  try {
    const config = {
      method: "GET",
      url: `/chat/archive/count`,
    };
    const response = await axiosInstance(config);
    return { success: true, count: response.data.count };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const newChats = async () => {
  try {
    const config = {
      method: "GET",
      url: `/chat/new-chat`,
    };
    const response = await axiosInstance(config);
    return { success: true, chats: response.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const reaction = async () => {
  try {
    const response = await axiosInstance.get(`/chat/reactions`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error while getting reactions", error);
    return { success: false };
  }
};

export const chatDelete = async (item) => {
  try {
    await axiosInstance.post(`/chat/delete`, [
      { chat: item.chat._id, chatType: item.chat.chatType },
    ]);
    return { success: true };
  } catch (error) {
    console.log("error while getting reactions", error);
    return { success: false };
  }
};

export const unreadChats = async () => {
  try {
    const response = await axiosInstance.get("/chat/unread");
    return response.data;
  } catch (error) {
    return { success: false };
  }
};
