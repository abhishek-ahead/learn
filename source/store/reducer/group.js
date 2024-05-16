import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: {},
};

const reducer = {
  addGroup: (state, action) => {
    try {
      const { _id } = action.payload;
      state.groups[_id] = { ...state.groups[_id], ...action.payload };
    } catch (error) {
      console.log("error while add group");
    }
  },
};

const chatsSlice = createSlice({
  name: "groups",
  initialState: initialState,
  reducers: reducer,
});

export const actions = chatsSlice.actions;
export default chatsSlice.reducer;
