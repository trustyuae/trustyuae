import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import Swal from "sweetalert2";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  orders: [],
  orderDetails: [],
  completedOrders: [],
  completedOrderDetails: [],
  reserveOrders: [],
  reserveOrderDetails: [],
  onHoldOrders: [],
  onHoldOrderDetails: [],
  uploadAttachFile: [],
  uploadOverAllAttachFile: [],
  message: [],
  orderPickUp: [],
  orderPickUpCancel: [],
  customOrderData: [],
  customOrderOnHoldData: [],
  customOrderOnHoldFinishData: [],
  error: null,
};

export const OrderSystemChinaGet = createAsyncThunk(
  "orderSystem/OrderSystemGet",
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

export const OrderDetailsChinaGet = createAsyncThunk(
    "orderSystem/OrderDetailsGet",
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(
          `wp-json/custom-orders-new/v1/orders/?orderid=${id}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching factories:", error.message);
        return rejectWithValue(error.message);
      }
    }
  );

export const CompletedOrderSystemChinaGet = createAsyncThunk(
  "orderSystem/CompletedOrderSystemGet",
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

export const CompletedOrderDetailsChinaGet = createAsyncThunk(
  "orderSystem/CompletedOrderDetailsGet",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-orders-completed/v1/completed-orders/?orderid=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const OnHoldOrderSystemChinaGet = createAsyncThunk(
  "orderSystem/OnHoldOrderSystemGet",
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

export const OnHoldOrderDetailsChinaGet = createAsyncThunk(
  "orderSystem/OnHoldOrderDetailsGet",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-onhold-orders/v1/onhold-orders/?orderid=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const ReserveOrderSystemChinaGet = createAsyncThunk(
  "orderSystem/ReserveOrderSystemGet",
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

export const ReserveOrderDetailsChinaGet = createAsyncThunk(
  "orderSystem/ReserveOrderDetailsGet",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-reserved-orders/v1/reserved-orders/?orderid=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AttachmentFileUploadChina = createAsyncThunk(
  "orderSystem/AttachmentFileUpload",
  async (
    { user_id, order_id, item_id, variation_id, selectedFile },
    { rejectWithValue }
  ) => {
    try {
      const requestData = new FormData();
      requestData.append("dispatch_image", selectedFile);
      const response = await axiosInstance.post(
        `wp-json/custom-order-attachment/v1/insert-attachment/${user_id}/${order_id}/${item_id}/${variation_id}`,
        requestData,
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

export const OverAllAttachmentFileUploadChina = createAsyncThunk(
  "orderSystem/OverAllAttachmentFileUpload",
  async ({ order_id, order_dispatch_image }, { rejectWithValue }) => {
    try {
      const requestData = new FormData();
      requestData.append("order_dispatch_image", order_dispatch_image);
      const response = await axiosInstance.post(
        `wp-json/order-complete-attachment/v1/order-attachment/${order_id}`,
        requestData,
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

export const AddMessageChina = createAsyncThunk(
  "orderSystem/AddMessage",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-message-note/v1/order-note/`,
        requestData
      );
      return response;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const InsertOrderPickupChina = createAsyncThunk(
  "orderSystem/InsertOrderPickup",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-order-pick/v1/insert-order-pickup/`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const InsertOrderPickupCancelChina = createAsyncThunk(
  "orderSystem/InsertOrderPickupCancel",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-order-cancel/v1/insert-order-cancel/`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const CustomOrderFinishChina = createAsyncThunk(
  "orderSystem/CustomOrderFinish",
  async ({ user_id, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-order-finish/v1/finish-order/${user_id}/${id}/?warehouse=China`
      );
      return response.data;
    } catch (error) {
      console.error("Error finishing custom order:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const CustomOrderOHChina = createAsyncThunk(
  "orderSystem/CustomOrderOH",
  async (result, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-onhold-orders-convert/v1/update_onhold_note/?warehouse=China`,
        result
      );
      return response;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const CustomOrderFinishOHChina = createAsyncThunk(
  "orderSystem/CustomOrderFinishOH",
  async ({ user_id, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-onhold-order-finish/v1/onhold-finish-order/${user_id}/${id}/?warehouse=China`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const orderSystemChinaSlice = createSlice({
  name: "orderSystem",
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
      state.orders = [];
      state.orderDetails = [];
      state.completedOrders = [];
      state.completedOrderDetails = [];
      state.reserveOrders = [];
      state.reserveOrderDetails = [];
      state.onHoldOrders = [];
      state.onHoldOrderDetails = [];
      state.uploadAttachFile = [];
      state.uploadOverAllAttachFile = [];
      state.message = [];
      state.orderPickUp = [];
      state.orderPickUpCancel = [];
      state.customOrderData = [];
      state.customOrderOnHoldData = [];
      state.customOrderOnHoldFinishData = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(OrderSystemChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OrderSystemChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(OrderSystemChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OrderDetailsChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OrderDetailsChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(OrderDetailsChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CompletedOrderSystemChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CompletedOrderSystemChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.completedOrders = action.payload;
      })
      .addCase(CompletedOrderSystemChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CompletedOrderDetailsChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CompletedOrderDetailsChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.completedOrderDetails = action.payload;
      })
      .addCase(CompletedOrderDetailsChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OnHoldOrderSystemChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OnHoldOrderSystemChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.onHoldOrders = action.payload;
      })
      .addCase(OnHoldOrderSystemChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OnHoldOrderDetailsChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OnHoldOrderDetailsChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.onHoldOrderDetails = action.payload;
      })
      .addCase(OnHoldOrderDetailsChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(ReserveOrderSystemChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ReserveOrderSystemChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reserveOrders = action.payload;
      })
      .addCase(ReserveOrderSystemChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(ReserveOrderDetailsChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ReserveOrderDetailsChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reserveOrderDetails = action.payload;
      })
      .addCase(ReserveOrderDetailsChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AttachmentFileUploadChina.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AttachmentFileUploadChina.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadAttachFile = action.payload;
      })
      .addCase(AttachmentFileUploadChina.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OverAllAttachmentFileUploadChina.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OverAllAttachmentFileUploadChina.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadOverAllAttachFile = action.payload;
      })
      .addCase(OverAllAttachmentFileUploadChina.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AddMessageChina.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddMessageChina.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(AddMessageChina.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(InsertOrderPickupChina.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(InsertOrderPickupChina.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderPickUp = action.payload;
      })
      .addCase(InsertOrderPickupChina.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(InsertOrderPickupCancelChina.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(InsertOrderPickupCancelChina.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderPickUpCancel = action.payload;
      })
      .addCase(InsertOrderPickupCancelChina.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CustomOrderFinishChina.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomOrderFinishChina.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOrderData = action.payload;
      })
      .addCase(CustomOrderFinishChina.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CustomOrderOHChina.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomOrderOHChina.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOrderOnHoldData = action.payload;
      })
      .addCase(CustomOrderOHChina.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CustomOrderFinishOHChina.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomOrderFinishOHChina.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOrderOnHoldFinishData = action.payload;
      })
      .addCase(CustomOrderFinishOHChina.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
orderSystemChinaSlice.actions;
export default orderSystemChinaSlice.reducer;