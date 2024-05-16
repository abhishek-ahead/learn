import axiosInstance from "../utils/axios";

export const getGroupInfo = async (id) => {
  try {
    const response = await axiosInstance.get(`/group/profile/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false };
  }
};

export const createGroup = async (data) => {
  try {
    const response = await axiosInstance.post("/group/create", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error while creating group", error);
    return { success: false };
  }
};

export const updateSetting = async (data) => {
  try {
    const response = await axiosInstance.put("/group/setting", data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error while updating group", error);
    return { success: false };
  }
};

export const exitGroup = async (data) => {
  try {
    const response = await axiosInstance.post("/group/leave", data);
    return { success: true, ...response.data };
  } catch (error) {
    console.log("error while exit group", error);
    return { success: false, error: error.message };
  }
};

export const addMember = async (data) => {
  try {
    const response = await axiosInstance.post("/group/add-user", data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const makeAdmin = async (data) => {
  try {
    const response = await axiosInstance.post("/group/make-admin", data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const dismissAdmin = async (data) => {
  try {
    const response = await axiosInstance.post("/group/dismiss-admin", data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeMember = async (data) => {
  try {
    const response = await axiosInstance.post("/group/remove", data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const groupMembers = async (data) => {
  try {
    const config = {
      method: "GET",
      url: `/group/users/${data.id}`,
      params: {
        page: data.page,
        limit: data.limit,
      },
    };
    const response = await axiosInstance(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const validatePassword = async (data) => {
  try {
    const response = await axiosInstance.post("/group/validate-password", data);
    if (response.data.success)
      return { success: true, message: "Valid Password" };
    return { success: false, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.message || error.message,
    };
  }
};

export const pendingMembers = async (id) => {
  try {
    const response = await axiosInstance.get(`/group/pending/${id}`,);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.message || error.message,
    };

  }
}

export const changePendingStatus = async (data) => {
  try {
    await axiosInstance.post("/group/pending", data)
    return { success: true, message: "status updated" }
  } catch (error) {
    return {
      success: false, message: error.response?.message || error.message,
    }
  }
}