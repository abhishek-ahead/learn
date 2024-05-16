import { CHAT_TYPE, REPORT_TYPE } from "../constant";
import axiosInstance from "../utils/axios";

export const report = async (item) => {
    try {
        await axiosInstance.post(`/user/report`, { report: item.chat._id, reportType: item.chat.chatType == CHAT_TYPE.user ? REPORT_TYPE.user : REPORT_TYPE.group, block: false, leave: false });
        return { success: true, };
    } catch (error) {
        console.log("Error while report", error);
        return { success: false }
    }
};

export const getTranslations = async () => {
    try {
        const response = await axiosInstance.get("/user/translation");
        return { success: true, data: response.data }
    } catch (error) {
        console.log("Error while report", error);
        return { success: false }
    }
}

export const getPermission = async () => {
    try {
        const response = await axiosInstance.get("/user/permissions");
        return { success: true, data: response.data }
    } catch (error) {
        console.log("error >>", error)
        return { success: false }
    }
}

export const about = async () => {
    try {
        const response = await axiosInstance.get("/user/about");
        return { success: true, data: response.data }
    } catch (error) {
        return { success: false }
    }
}

export const deleteAbout = async (data) => {
    try {
        const response = await axiosInstance.delete("/user/about", { data })
        return { success: true, data: response.data }
    } catch (error) {
        return { success: false }
    }
}

export const updateAbout = async (data) => {
    try {
        const response = await axiosInstance.post("/user/about", data)
        return { success: true, data: response.data }
    } catch (error) {
        return { success: false }
    }
}