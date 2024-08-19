import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  erManagementData: [],
  error: null,
};

export const GetErManagementData = createAsyncThunk(
  "ErManagement/GetErManagementData",
  async (apiUrl, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const erManagementSlice = createSlice({
  name: "erManagement",
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
      state.erManagementData = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetErManagementData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetErManagementData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.erManagementData = action.payload;
      })
      .addCase(GetErManagementData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
erManagementSlice.actions;
export default erManagementSlice.reducer;
