import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import Swal from "sweetalert2";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  ordersTracking: [],
  orderTrackingDetails: [],
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
  customItemSendToUAEData: [],
  customItemSendToP2: [],
  assignTrackID: [],
  pushTrackOrder: [],
  trackIDFileUploadData: [],
  updateTrackingID:[],
  error: null,
};

export const OrderTrackingSystemChinaGet = createAsyncThunk(
  "orderSystem/OrderTrackingSystemChinaGet",
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

export const OrderTrackingDetailsChinaGet = createAsyncThunk(
  "orderSystem/OrderTrackingDetailsChinaGet",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-orders-new/v1/orders/?warehouse=China&trackorder=0&orderid=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

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
        `wp-json/custom-orders-new/v1/orders/?warehouse=China&trackorder=1&orderid=${id}`
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
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-orders-completed/v1/completed-orders/?&orderid=${id}`
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
        `wp-json/custom-onhold-orders/v1/onhold-orders/?warehouse=China&orderid=${id}`
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
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-reserved-orders/v1/reserved-orders/?warehouse=China&orderid=${id}`
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
        `wp-json/custom-order-attachment/v1/insert-attachment/${user_id}/${order_id}/${item_id}/${variation_id}/?warehouse=China`,
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
        `wp-json/order-complete-attachment/v1/order-attachment/${order_id}/?warehouse=China`,
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
        `wp-json/custom-message-note/v1/order-note/?warehouse=China`,
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
        `wp-json/custom-order-pick/v1/insert-order-pickup/?warehouse=China`,
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
        `wp-json/custom-order-cancel/v1/insert-order-cancel/?warehouse=China`,
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

export const CustomItemSendToUAE = createAsyncThunk(
  "orderSystem/CustomItemSendToUAE",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-push-order/v1/push-order-china/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const CustomItemSendToP2 = createAsyncThunk(
  "orderSystem/CustomItemSendToP2",
  async ({ id, payload }, { rejectWithValue }) => {
    console.log(payload, "payload from CustomItemSendToP2");
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-onhold-order-convert/v1/onhold_to_backorder/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const AssignTrackID = createAsyncThunk(
  "orderSystem/AssignTrackID",
  async ({ orderId, payload }, { rejectWithValue }) => {
    console.log(payload, "payload from CustomItemSendToP2");
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-add-trackid/v1/add-trackid-order/${orderId}/?warehouse=China`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const PushTrackOrder = createAsyncThunk(
  "orderSystem/PushTrackOrder",
  async ({ payload }, { rejectWithValue }) => {
    console.log(payload, "payload from CustomItemSendToP2");
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-push-trackid/v1/push-trackid-order/?warehouse=China`,
        payload
      );
      console.log(response.data, "response.data");
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const TrackIDFileUpload = createAsyncThunk(
  "orderSystem/TrackIDFileUpload",
  async (formData, { rejectWithValue }) => {
    console.log(formData, "FormData");
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-csv-file/v1/csv-file-upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data, "response.data from TrackIDFileUpload");
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const TrackingIDUpdate = createAsyncThunk(
  "orderSystem/TrackingIDUpdate",
  async ({id,payload}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`wp-json/custom-add-trackid/v1/add-trackid-order/${id}/?warehouse=China`,payload)
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error.message);
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
      state.ordersTracking = [];
      state.orderTrackingDetails = [];
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
      state.customItemSendToUAEData = [];
      state.customItemSendToP2 = [];
      state.assignTrackID = [];
      state.pushTrackOrder = [];
      state.trackIDFileUploadData = [];
      state.updateTrackingID = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(OrderTrackingSystemChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OrderTrackingSystemChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersTracking = action.payload;
      })
      .addCase(OrderTrackingSystemChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OrderTrackingDetailsChinaGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OrderTrackingDetailsChinaGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderTrackingDetails = action.payload;
      })
      .addCase(OrderTrackingDetailsChinaGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
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
      .addCase(CustomItemSendToUAE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomItemSendToUAE.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customItemSendToUAEData = action.payload;
      })
      .addCase(CustomItemSendToUAE.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(CustomItemSendToP2.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomItemSendToP2.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customItemSendToP2 = action.payload;
      })
      .addCase(CustomItemSendToP2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(AssignTrackID.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AssignTrackID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignTrackID = action.payload;
      })
      .addCase(AssignTrackID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(PushTrackOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(PushTrackOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pushTrackOrder = action.payload;
      })
      .addCase(PushTrackOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(TrackIDFileUpload.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(TrackIDFileUpload.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trackIDFileUploadData = action.payload;
      })
      .addCase(TrackIDFileUpload.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(TrackingIDUpdate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(TrackingIDUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateTrackingID = action.payload;
      })
      .addCase(TrackingIDUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
  orderSystemChinaSlice.actions;
export default orderSystemChinaSlice.reducer;
