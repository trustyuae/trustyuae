import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  allProducts: [],
  editProducts: [],
  error: null,
};

export const GetAllProductsList = createAsyncThunk(
  "factory/GetAllProductsList",
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

export const EditProductsList = createAsyncThunk(
  "factory/EditProductsList",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-proimage-update/v1/update-product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const ProductManagementSlice = createSlice({
  name: "ProductManagement",
  initialState,
  reducers: {
    startSyncLoading: (state) => {
      state.SyncLoading = true;
    },
    stopSyncLoading: (state) => {
      state.SyncLoading = false;
    },
    clearstoredata: (state) => {
      (state.isLoading = false);
        (state.SyncLoading = false);
        (state.allProducts = []);
        (state.editProducts = []);
        (state.error = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllProductsList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAllProductsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allProducts = action.payload;
      })
      .addCase(GetAllProductsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(EditProductsList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(EditProductsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editProducts = action.payload;
      })
      .addCase(EditProductsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
  ProductManagementSlice.actions;
export default ProductManagementSlice.reducer;
