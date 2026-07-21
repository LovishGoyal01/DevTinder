import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    isLoaded: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.data = action.payload;
      state.isLoaded = true;
    },
    removeUser: (state) => {
      state.data = null;
      state.isLoaded = false;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
