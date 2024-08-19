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

export const OrderSystemGet = createAsyncThunk(
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

export const OrderDetailsGet = createAsyncThunk(
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

export const CompletedOrderSystemGet = createAsyncThunk(
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

export const CompletedOrderDetailsGet = createAsyncThunk(
  "orderSystem/CompletedOrderDetailsGet",
  async (id, { rejectWithValue }) => {
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

export const OnHoldOrderSystemGet = createAsyncThunk(
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

export const OnHoldOrderDetailsGet = createAsyncThunk(
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

export const ReserveOrderSystemGet = createAsyncThunk(
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

export const ReserveOrderDetailsGet = createAsyncThunk(
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

export const AttachmentFileUpload = createAsyncThunk(
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

export const OverAllAttachmentFileUpload = createAsyncThunk(
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

export const AddMessage = createAsyncThunk(
  "orderSystem/AddMessage",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-message-note/v1/order-note/`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const InsertOrderPickup = createAsyncThunk(
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

export const InsertOrderPickupCancel = createAsyncThunk(
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

export const CustomOrderFinish = createAsyncThunk(
  "orderSystem/CustomOrderFinish",
  async ({ user_id, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-order-finish/v1/finish-order/${user_id}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error finishing custom order:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const CustomOrderOH = createAsyncThunk(
  "orderSystem/CustomOrderOH",
  async (result, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-onhold-orders-convert/v1/update_onhold_note/`,
        result
      );
      return response;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const CustomOrderFinishOH = createAsyncThunk(
  "orderSystem/CustomOrderFinishOH",
  async ({ user_id, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-onhold-order-finish/v1/onhold-finish-order/${user_id}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const orderSystemSlice = createSlice({
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
      .addCase(OrderSystemGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OrderSystemGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(OrderSystemGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OrderDetailsGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OrderDetailsGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(OrderDetailsGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CompletedOrderSystemGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CompletedOrderSystemGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.completedOrders = action.payload;
      })
      .addCase(CompletedOrderSystemGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CompletedOrderDetailsGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CompletedOrderDetailsGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.completedOrderDetails = action.payload;
      })
      .addCase(CompletedOrderDetailsGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OnHoldOrderSystemGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OnHoldOrderSystemGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.onHoldOrders = action.payload;
      })
      .addCase(OnHoldOrderSystemGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OnHoldOrderDetailsGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OnHoldOrderDetailsGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.onHoldOrderDetails = action.payload;
      })
      .addCase(OnHoldOrderDetailsGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(ReserveOrderSystemGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ReserveOrderSystemGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reserveOrders = action.payload;
      })
      .addCase(ReserveOrderSystemGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(ReserveOrderDetailsGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ReserveOrderDetailsGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reserveOrderDetails = action.payload;
      })
      .addCase(ReserveOrderDetailsGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AttachmentFileUpload.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AttachmentFileUpload.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadAttachFile = action.payload;
      })
      .addCase(AttachmentFileUpload.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OverAllAttachmentFileUpload.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OverAllAttachmentFileUpload.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadOverAllAttachFile = action.payload;
      })
      .addCase(OverAllAttachmentFileUpload.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AddMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(AddMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(InsertOrderPickup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(InsertOrderPickup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderPickUp = action.payload;
      })
      .addCase(InsertOrderPickup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(InsertOrderPickupCancel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(InsertOrderPickupCancel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderPickUpCancel = action.payload;
      })
      .addCase(InsertOrderPickupCancel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CustomOrderFinish.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomOrderFinish.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOrderData = action.payload;
      })
      .addCase(CustomOrderFinish.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CustomOrderOH.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomOrderOH.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOrderOnHoldData = action.payload;
      })
      .addCase(CustomOrderOH.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CustomOrderFinishOH.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomOrderFinishOH.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOrderOnHoldFinishData = action.payload;
      })
      .addCase(CustomOrderFinishOH.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
orderSystemSlice.actions;
export default orderSystemSlice.reducer;
