import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./reducer";
import groupSlice from "./reducer/group";

const store = configureStore({
  reducer: {
    chats: chatSlice,
    group: groupSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export default store;
