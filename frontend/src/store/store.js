import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice.js";
import snippetReducer from "./slices/snippet.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    snippet: snippetReducer,
  },
});
