import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios.js";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("user/register", userData);
      return response?.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || error.messsage || "Registration failed";
      return rejectWithValue(errorMsg);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("user/login", userData);
      return response?.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || error.messsage || "Login failed";
      return rejectWithValue(errorMsg);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("user/logout");
      return response?.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || error.messsage || "Logout failed";
      return rejectWithValue(errorMsg);
    }
  },
);

export const checkUserStatus = createAsyncThunk(
  "auth/checkUserStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("user/status");

      return response?.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || error.messsage || "Session expired";
      return rejectWithValue(errorMsg);
    }
  },
);
