import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import ShowAlert from "../../utils/ShowAlert";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  productManual: [],
  grn: [],
  grnList: [],
  grnView: [],
  productDetails: [],
  productOrderDetails: [],
  productOrdersPrep: [],
  productOrdersStock: [],
  error: null,
};

export const GetProductManual = createAsyncThunk(
  "factory/GetProductManual",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AddGrn = createAsyncThunk(
  "factory/AddGrn",
  async ({ payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/create-po-grn/v1/create-grn-by-po/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        const result = await ShowAlert(
          "Success",
          response.data,
          "success",
          true,
          false,
          "OK"
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const GetGRNList = createAsyncThunk(
  "factory/GetGRNList",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const GetGRNView = createAsyncThunk(
  "factory/GetGRNView",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const GetProductDetails = createAsyncThunk(
  "factory/GetProductDetails",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const GetProductOrderDetails = createAsyncThunk(
  "factory/GetProductOrderDetails",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AddProductOrderForPre = createAsyncThunk(
  "factory/AddProductOrderForPre",
  async ({ requestedDataP }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/order-preparation-api/v1/order-send-by-product/`,
        requestedDataP
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AddProductOrderForStock = createAsyncThunk(
  "factory/AddProductOrderForStock",
  async ({ requestedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-instock-api/v1/quantity-instock-api/`,
        requestedData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const P3SystemSlice = createSlice({
  name: "P3System",
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
        (state.productManual = []);
        (state.grn = []);
        (state.grnList = []);
        (state.grnView = []);
        (state.productDetails = []);
        (state.productOrderDetails = []);
        (state.productOrdersPrep = []);
        (state.productOrdersStock = []);
        (state.error = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetProductManual.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetProductManual.fulfilled, (state, action) => {
        state.isLoading = false;
        state.factory = action.data;
      })
      .addCase(GetProductManual.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.data;
      })
      .addCase(AddGrn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddGrn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editFactory = action.data;
      })
      .addCase(AddGrn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.data;
      })
      .addCase(GetGRNList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetGRNList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addFactory = action.data;
      })
      .addCase(GetGRNList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.data;
      })
      .addCase(GetGRNView.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetGRNView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addFactory = action.data;
      })
      .addCase(GetGRNView.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.data;
      })
      .addCase(GetProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addFactory = action.data;
      })
      .addCase(GetProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.data;
      })
      .addCase(GetProductOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetProductOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addFactory = action.data;
      })
      .addCase(GetProductOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.data;
      })
      .addCase(AddProductOrderForPre.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddProductOrderForPre.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addFactory = action.data;
      })
      .addCase(AddProductOrderForPre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.data;
      })
      .addCase(AddProductOrderForStock.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddProductOrderForStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addFactory = action.data;
      })
      .addCase(AddProductOrderForStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.data;
      });
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
  P3SystemSlice.actions;
export default P3SystemSlice.reducer;
