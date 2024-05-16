import { LIMIT } from "../constant";
import axiosInstance from "../utils/axios";

export const fetchMessages = async ({
  chatId,
  chatType,
  lastMessage,
  password,
}) => {
  try {
    const config = {
      method: "POST",
      url: `/message/${chatId}/${chatType}`,
      data: { password },
      params: {
        limit: LIMIT,
        lastMessage,
      },
    };
    const response = await axiosInstance(config);
    const { messages, more } = response.data;
    return { success: true, messages, more };
  } catch (error) {
    console.log("Error while fetching Messages", error);
    return { success: false, message: error.message };
  }
};

export const sendMessage = async (data) => {
  try {
    const response = await axiosInstance.post("/message", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error while sending message", error);
    return false;
  }
};

export const sendReaction = async (data) => {
  try {
    await axiosInstance.post("/message/reaction", data);
    return true;
  } catch (error) {
    console.log("Error while sending message", error);
    return false;
  }
};

export const removeReaction = async (data) => {
  try {
    await axiosInstance.post("/message/remove-reaction", data);
    return true;
  } catch (error) {
    console.log("Error while sending message", error);
    return false;
  }
};

export const messageMedia = async ({
  chat,
  chatType,
  mediaType,
  lastMessage,
}) => {
  try {
    const response = await axiosInstance.get(
      `/message/media/${chat}/${chatType}/${mediaType}`,
      { params: { lastMessage, limit: LIMIT } }
    );
    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    return { success: false };
  }
};

export const starredMessage = async ({ chat, chatType }) => {
  try {
    const response = await axiosInstance.get(
      `/message/starred/${chat}/${chatType}`
    );
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false };
  }
};

export const forwardMessage = async (data) => {
  try {
    await axiosInstance.post("/message/forward", data);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const deleteMessage = async (data) => {
  try {
    await axiosInstance.post("/message/delete", data);
    return { success: true };
  } catch (error) {
    console.log("error <<>>", error);
    return { success: false };
  }
};

export const deleteMessageEveryone = async (data) => {
  try {
    await axiosInstance.post("/message/delete-everyone", data);
  } catch (error) {
    console.log("error while delete  >", error);
    return { success: false };
  }
};

export const markStarred = async (data) => {
  try {
    await axiosInstance.post("/message/starred", data);
  } catch (error) {
    console.log("error while starred message", error);
    return { success: false };
  }
};

export const markUnstarred = async (data) => {
  try {
    await axiosInstance.post("/message/unstarred", data);
  } catch (error) {
    console.log("error while starred message", error);
    return { success: false };
  }
};
