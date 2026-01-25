import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  checkUserStatus,
  loginUser,
  logoutUser,
} from "../thunks/auth.thunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  loading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.success = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.success = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.success = "Logout successful";
      })

      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = "Logout failed";
      })

      .addCase(checkUserStatus.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkUserStatus.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkUserStatus.rejected, (state, action) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;
