import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import ShowAlert from "../../utils/ShowAlert";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  productManual: [],
  grn: [],
  grnList: [],
  grnListOnOrderIds: [],
  grnView: [],
  productDetails: [],
  productOrderDetails: [],
  productOrdersPrep: [],
  productOrdersStock: [],
  remark: [],
  allProducts: [],
  poProductData: [],
  ordersData: [],
  assignOrderData: [],
  pendingItemsData: [],
  pendingItemsData: [],
  poidsData: [],
  poidwithPendingProducts: [],
  error: null,
};

export const GetProductManual = createAsyncThunk(
  "P3System/GetProductManual",
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
  "P3System/AddGrn",
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
  "P3System/GetGRNList",
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

export const GetGRNListOnBasisOrderId = createAsyncThunk(
  "P3System/GetGRNListOnBasisOrderId",
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
  "P3System/GetGRNView",
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
  "P3System/GetProductDetails",
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
  "P3System/GetProductOrderDetails",
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
  "P3System/AddProductOrderForPre",
  async ({ requestedDataP }, { rejectWithValue }) => {
    console.log(requestedDataP, "requestedDataP");
    try {
      const response = await axiosInstance.post(
        `wp-json/order-preparation-api/v1/order-send-by-product/`,
        requestedDataP
      );
      console.log(response, "response from AddProductOrderForPre");
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AddProductOrderForStock = createAsyncThunk(
  "P3System/AddProductOrderForStock",
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
  "P3System/AddRemark",
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
  "P3System/GetAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-api-product/v1/get-product/?`
      );
      return response.data;
    } catch (error) {
      console.error("Error while gettting AllProducts:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const FetchPoProductData = createAsyncThunk(
  "P3System/FetchPoProductData",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error while gettting AllProducts:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const GetOrderIdsData = createAsyncThunk(
  "P3System/GetOrderIdsData",
  async ({ payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-get-order/v1/get-order-id/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "response");
      return response.data;
    } catch (error) {
      console.error("Error while getting OrderIds:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AssignOrders = createAsyncThunk(
  "P3System/AssignOrders",
  async ({ payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-assign-order/v1/assign-item-order/`,
        payload
      );
      console.log(response, "response");
      return response;
    } catch (error) {
      console.error("Error while gettting AllProducts:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const FetchPendingItemsData = createAsyncThunk(
  "P3System/FetchPendingItemsData",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-not-grn/v1/grn-missing-orders/${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error while gettting AllProducts:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const FetchPoIds = createAsyncThunk(
  "P3System/FetchPoIds",
  async ({ selectedFactory, selectedPOId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/get-po-ids/v1/show-po-id/`,
        {
          params: {
            factory_id: selectedFactory,
            po_id: selectedPOId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error while gettting Poids:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const FetchPoIdsWithPendingProductData = createAsyncThunk(
  "P3System/FetchPoIdsWithPendingProductData",
  async ({ selectedFactory, selectedPOId }, { rejectWithValue }) => {
    console.log(selectedFactory,"selectedFactory")
    console.log(selectedPOId,"selectedPOId")
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-get-products/v1/get-pending-grn-list/`,
        {
          params: {
            factory_id: selectedFactory,
            po_id: selectedPOId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error while gettting poids with product data:", error.message);
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
      state.grnListOnOrderIds = [];
      state.grnView = [];
      state.productDetails = [];
      state.productOrderDetails = [];
      state.productOrdersPrep = [];
      state.productOrdersStock = [];
      state.remark = [];
      state.allProducts = [];
      state.poProductData = [];
      state.ordersData = [];
      state.assignOrderData = [];
      state.pendingItemsData = [];
      state.poidsData = [];
      state.poidwithPendingProducts = [];
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
      .addCase(GetGRNListOnBasisOrderId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetGRNListOnBasisOrderId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.grnListOnOrderIds = action.payload;
      })
      .addCase(GetGRNListOnBasisOrderId.rejected, (state, action) => {
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
      })
      .addCase(GetOrderIdsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetOrderIdsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersData = action.payload;
      })
      .addCase(GetOrderIdsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AssignOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AssignOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignOrderData = action.payload;
      })
      .addCase(AssignOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(FetchPendingItemsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FetchPendingItemsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingItemsData = action.payload;
      })
      .addCase(FetchPendingItemsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(FetchPoIds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FetchPoIds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.poidsData = action.payload;
      })
      .addCase(FetchPoIds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(FetchPoIdsWithPendingProductData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FetchPoIdsWithPendingProductData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.poidwithPendingProducts = action.payload;
      })
      .addCase(FetchPoIdsWithPendingProductData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
  P3SystemSlice.actions;
export default P3SystemSlice.reducer;
