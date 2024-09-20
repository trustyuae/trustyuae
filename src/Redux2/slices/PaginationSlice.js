import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  currentPage: 1,
  error: null,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    startSyncLoading: (state) => {
      state.SyncLoading = true;
    },
    stopSyncLoading: (state) => {
      state.SyncLoading = false;
    },
    clearstoredata: (state) => {
      state.isLoading = false;
      state.SyncLoading = false;
      state.currentPage = 1;
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetPage: (state) => {
      state.currentPage = 1;
    }
  },
});

export const {
  clearstoredata,
  startSyncLoading,
  stopSyncLoading,
  setCurrentPage,
  resetPage
} = paginationSlice.actions;
export default paginationSlice.reducer;
