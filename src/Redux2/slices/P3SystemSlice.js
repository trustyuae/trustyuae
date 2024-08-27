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
  remark: [],
  allProducts: [],
  poProductData: [],
  error: null,
};

export const GetProductManual = createAsyncThunk(
  "factory/GetProductManual",
  async (apiUrl, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      console.log(response, "response from product manual");
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AddGrn = createAsyncThunk(
  "factory/AddGrn",
  async (payload, { rejectWithValue }) => {
    try {
      console.log(payload, "payload");
      const response = await axiosInstance.post(
        `wp-json/create-po-grn/v1/create-grn-by-po/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
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
  async (requestedDataP, { rejectWithValue }) => {
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

export const AddRemark = createAsyncThunk(
  "orderSystem/AddRemark",
  async ({ selectedGrnNo, requestedMessage }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-remark/v1/grn-remark/${selectedGrnNo}`,
        requestedMessage
      );
      return response.data;
    } catch (error) {
      console.error("Error adding remark:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const GetAllProducts = createAsyncThunk(
  "orderSystem/GetAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-api-product/v1/get-product/?`,
      );
      return response.data;
    } catch (error) {
      console.error("Error while gettting AllProducts:", error.message);
      return rejectWithValue(error.message);
    }
  }
);


export const FetchPoProductData = createAsyncThunk(
  "orderSystem/FetchPoProductData",
  async ({selectedPOId}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/fetch-po-details/v1/get-product-under-po/${selectedPOId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error while gettting AllProducts:", error.message);
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
      state.isLoading = false;
      state.SyncLoading = false;
      state.productManual = [];
      state.grn = [];
      state.grnList = [];
      state.grnView = [];
      state.productDetails = [];
      state.productOrderDetails = [];
      state.productOrdersPrep = [];
      state.productOrdersStock = [];
      state.remark = [];
      state.allProducts = [];
      state.poProductData = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetProductManual.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetProductManual.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productManual = action.payload;
      })
      .addCase(GetProductManual.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AddGrn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddGrn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.grn = action.payload;
      })
      .addCase(AddGrn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(GetGRNList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetGRNList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.grnList = action.payload;
      })
      .addCase(GetGRNList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(GetGRNView.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetGRNView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.grnView = action.payload;
      })
      .addCase(GetGRNView.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(GetProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(GetProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(GetProductOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetProductOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productOrderDetails = action.payload;
      })
      .addCase(GetProductOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AddProductOrderForPre.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddProductOrderForPre.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productOrdersPrep = action.payload;
      })
      .addCase(AddProductOrderForPre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AddProductOrderForStock.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddProductOrderForStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productOrdersStock = action.payload;
      })
      .addCase(AddProductOrderForStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AddRemark.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddRemark.fulfilled, (state, action) => {
        state.isLoading = false;
        state.remark = action.payload;
      })
      .addCase(AddRemark.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(GetAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allProducts = action.payload;
      })
      .addCase(GetAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(FetchPoProductData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FetchPoProductData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.poProductData = action.payload;
      })
      .addCase(FetchPoProductData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
  P3SystemSlice.actions;
export default P3SystemSlice.reducer;
