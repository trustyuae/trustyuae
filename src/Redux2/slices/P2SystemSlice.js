import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import ShowAlert from "../../utils/ShowAlert";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  poDetailsData: [],
  manualOrScheduledPoDetailsData: [],
  perticularPoDetailsData: [],
  quantityDetailsData: [],
  quantityDetailsDataOnPoDetails: [],
  addedPoData: [],
  addedManualPoData: [],
  addedSchedulePoData: [],
  updatedPoDetails: [],
  pomSystemProductDetails: [],
  ordersNotAvailable: [],
  ordersNotAvailablePo: [],
  ordersNotAvailableStatus: [],
  error: null,
};

export const PoDetailsData = createAsyncThunk(
  "P2System/PoDetailsData",
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

export const ManualOrScheduledPoDetailsData = createAsyncThunk(
  "P2System/ManualOrScheduledPoDetailsData",
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

export const PerticularPoDetails = createAsyncThunk(
  "P2System/PerticularPoDetails",
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

export const QuantityPoDetails = createAsyncThunk(
  "P2System/QuantityPoDetails",
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-preorder-product/v1/pre-order-product-detail/${productId}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const QuantityPoDetailsForModalInView = createAsyncThunk(
  "P2System/QuantityPoDetailsForModalInView",
  async ({ productId, variationId, poId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/preorder-product-po/v1/pre-order-product-detail-single-po/${productId}/${poId}/${variationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AddPO = createAsyncThunk(
  "P2System/AddPO",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-po-number/v1/po-id-generate/`,
        payload
      );
      return response;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AddManualPO = createAsyncThunk(
  "P2System/AddManualPO",
  async ({ payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-manual-order/v1/post-order-manual/`,
        payload
      );
      return response;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AddSchedulePO = createAsyncThunk(
  "P2System/AddSchedulePO",
  async ( payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-schedule-order/v1/post-order-schedule/`,
        payload
      );
      return response;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const UpdatePODetails = createAsyncThunk(
  "P2System/UpdatePODetails",
  async ({ apiUrl, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl, payload);
      const result = await ShowAlert(
        response.data.message,
        "",
        "success",
        true,
        false,
        "OK"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const PomSystemProductsDetails = createAsyncThunk(
  "P2System/PomSystemProductsDetails",
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

export const OrderNotAvailableData = createAsyncThunk(
  "P2System/OrderNotAvailableData",
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

export const OrderNotAvailableDataPo = createAsyncThunk(
  "P2System/OrderNotAvailableDataPo",
  async ({ requestData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-so-create/v1/convert-so-order/`,
        requestData
      );
      return response;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const OrderNotAvailableDataStatus = createAsyncThunk(
  "P2System/OrderNotAvailableDataStatus",
  async ({ requestedDataS }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance
        .post(`wp-json/order-not-update/v1/order-not-btn/`, requestedDataS)
        .then(async (response) => {
          await ShowAlert(
            "Status Updated Successfully!",
            "",
            "success",
            false,
            false,
            "",
            "",
            1000
          );
        })
        .catch((error) => {
          console.error(error);
        });
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const P2SystemSlice = createSlice({
  name: "P2System",
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
      state.poDetailsData = [];
      state.manualOrScheduledPoDetailsData = [];
      state.perticularPoDetailsData = [];
      state.quantityDetailsData = [];
      state.quantityDetailsDataOnPoDetails = [];
      state.addedPoData = [];
      state.addedManualPoData = [];
      state.addedSchedulePoData = [];
      state.updatedPoDetails = [];
      state.pomSystemProductDetails = [];
      state.ordersNotAvailable = [];
      state.ordersNotAvailablePo = [];
      state.ordersNotAvailableStatus = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PoDetailsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(PoDetailsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.poDetailsData = action.payload;
      })
      .addCase(PoDetailsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(ManualOrScheduledPoDetailsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ManualOrScheduledPoDetailsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.manualOrScheduledPoDetailsData = action.payload;
      })
      .addCase(ManualOrScheduledPoDetailsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(PerticularPoDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(PerticularPoDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.perticularPoDetailsData = action.payload;
      })
      .addCase(PerticularPoDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(QuantityPoDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(QuantityPoDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quantityDetailsData = action.payload;
      })
      .addCase(QuantityPoDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(QuantityPoDetailsForModalInView.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(QuantityPoDetailsForModalInView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quantityDetailsDataOnPoDetails = action.payload;
      })
      .addCase(QuantityPoDetailsForModalInView.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AddPO.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddPO.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addedPoData = action.payload;
      })
      .addCase(AddPO.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AddManualPO.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddManualPO.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addedManualPoData = action.payload;
      })
      .addCase(AddManualPO.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AddSchedulePO.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddSchedulePO.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addedSchedulePoData = action.payload;
      })
      .addCase(AddSchedulePO.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(UpdatePODetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UpdatePODetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updatedPoDetails = action.payload;
      })
      .addCase(UpdatePODetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(PomSystemProductsDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(PomSystemProductsDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pomSystemProductDetails = action.payload;
      })
      .addCase(PomSystemProductsDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OrderNotAvailableData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OrderNotAvailableData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersNotAvailable = action.payload;
      })
      .addCase(OrderNotAvailableData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OrderNotAvailableDataPo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OrderNotAvailableDataPo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersNotAvailablePo = action.payload;
      })
      .addCase(OrderNotAvailableDataPo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OrderNotAvailableDataStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OrderNotAvailableDataStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersNotAvailableStatus = action.payload;
      })
      .addCase(OrderNotAvailableDataStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
  P2SystemSlice.actions;
export default P2SystemSlice.reducer;
