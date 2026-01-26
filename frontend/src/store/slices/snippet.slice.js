import { createSlice } from "@reduxjs/toolkit";
import {
  addSnippet,
  deleteSnippet,
  getAllPublicSnippets,
  getAllUserSnippets,
  getSnippetById,
} from "../thunks/snippet.thunk";

const initialState = {
  snippets: [],
  snippet: null,
  totalPages: 1,
  currentPage: 1,
  loading: true,
  error: null,
};

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const handleFulfilled = (state, action) => {
  state.loading = false;
  const { data, pagination } = action.payload;

  state.currentPage = pagination.currentPage;
  state.totalPages = pagination.totalPages;

  if (pagination.currentPage === 1) {
    state.snippets = data;
  } else {
    state.snippets = [...state.snippets, ...data];
  }
};

const snippetSlice = createSlice({
  name: "snippet",
  initialState,
  reducers: {
    clearSnippets: (state) => {
      state.snippets = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.snippets.push(action.payload);
        state.error = null;
      })
      .addCase(addSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllPublicSnippets.pending, handlePending)
      .addCase(getAllPublicSnippets.fulfilled, handleFulfilled)
      .addCase(getAllPublicSnippets.rejected, handleRejected)
      .addCase(getAllUserSnippets.pending, handlePending)
      .addCase(getAllUserSnippets.fulfilled, handleFulfilled)
      .addCase(getAllUserSnippets.rejected, handleRejected)
      .addCase(getSnippetById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.snippet = null;
      })
      .addCase(getSnippetById.fulfilled, (state, action) => {
        state.loading = false;
        state.snippet = action.payload.data;
      })
      .addCase(getSnippetById.rejected, handleRejected)

      .addCase(deleteSnippet.pending, handlePending)
      .addCase(deleteSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.snippet = null;
        state.snippets = state.snippets.filter(
          (s) => s._id !== action.meta.arg,
        );
      })
      .addCase(deleteSnippet.rejected, handleRejected);
  },
});
export const { clearSnippets } = snippetSlice.actions;
export default snippetSlice.reducer;
