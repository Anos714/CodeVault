import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  checkUserStatus,
  loginUser,
} from "../thunks/auth.thunks";

const initialState = {
  user: null,
  error: null,
  loading: true,
  success: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.success = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.success = null;
      })
      .addCase(checkUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.user = null;
      })
      .addCase(checkUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = "Registration successful";
      })
      .addCase(checkUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.success = null;
      });
  },
});

export default authSlice.reducer;
