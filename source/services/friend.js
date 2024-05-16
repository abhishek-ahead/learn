import axiosInstance from "../utils/axios";

export const activeFriends = async () => {
  try {
    const response = await axiosInstance.get("/friend/active");
    return {
      success: true,
      users: response.data.data,
      count: response.data.count,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};


export const blockFriend = async (chat) => {
  try {
    await axiosInstance.post("/friend/block", { user: chat.chat._id });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const unblockFriend = async (chat) => {
  try {
    await axiosInstance.post("/friend/unblock", { user: chat.chat._id });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};
