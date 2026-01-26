import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export const addSnippet = createAsyncThunk(
  "snippet/addSnippet",
  async (snippetData, { rejectWithValue }) => {
    try {
      const response = await api.post("snippet/add", snippetData);

      return response?.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || error.messsage || "Failed to add snippet";
      return rejectWithValue(errorMsg);
    }
  },
);

export const getAllPublicSnippets = createAsyncThunk(
  "snippet/getAllPublic",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/snippet/all?page=${page}&search=${search}&limit=9`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching snippets",
      );
    }
  },
);

export const getAllUserSnippets = createAsyncThunk(
  "snippet/getAllUser",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `snippet/user/me?page=${page}&search=${search}&limit=9`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching snippets",
      );
    }
  },
);

export const getSnippetById = createAsyncThunk(
  "snippet/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/snippet/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching snippet",
      );
    }
  },
);

export const deleteSnippet = createAsyncThunk(
  "snippet/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/snippet/delete/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting snippet",
      );
    }
  },
);
