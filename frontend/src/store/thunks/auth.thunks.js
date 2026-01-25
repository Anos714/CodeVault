import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios.js";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("user/register", userData);

      return response?.data;
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Registration failed";
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
      const errorMsg = error.response?.data?.msg || "Login failed";
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
      const errorMsg = error.response?.data?.msg || "Registration failed";
      return rejectWithValue(errorMsg);
    }
  },
);
