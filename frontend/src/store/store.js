import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});