import { LIMIT } from "../constant";
import axiosInstance from "../utils/axios";

export const allStarredMessage = async (lastMessage) => {
  try {
    const config = {
      url: `/setting/starred`,
      method: "GET",
      params: {
        limit: LIMIT,
        lastMessage: lastMessage
      }
    }
    const response = await axiosInstance(config);
    return { success: true, data: response.data.data, more: response.data.more };
  } catch (error) {
    return { success: false };
  }
};

export const getNotificationSetting = async () => {
  try {
    const response = await axiosInstance.get("/setting/notification");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false };
  }
};

export const updateNotificationSetting = async (data) => {
  try {
    const response = await axiosInstance.post("/setting/notification", data);
    return { success: true, data: response.data.notification };
  } catch (error) {
    return { success: false };
  }
};

export const getPrivacySetting = async () => {
  try {
    const response = await axiosInstance.get("/setting/privacy");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false };
  }
}

export const updatePrivacySetting = async (data) => {
  try {
    const response = await axiosInstance.post("/setting/privacy", data);
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false }
  }
}