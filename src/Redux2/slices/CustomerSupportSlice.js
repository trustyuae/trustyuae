import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";

const initialState = {
  isLoading: false,
  csOrders: [],
  csOrdersPagination: null,
  isAccountOrdersLoading: false,
  accountOrders: [],
  accountOrdersPagination: null,
  accountOrdersError: null,
  isProductionOrdersLoading: false,
  productionOrders: [],
  productionOrdersPagination: null,
  productionOrdersError: null,
  isCsCompletedOrdersLoading: false,
  csCompletedOrders: [],
  csCompletedOrdersPagination: null,
  csCompletedOrdersError: null,
  customerSupportUsers: [],
  customerSupportUsersLoading: false,
  customerSupportUsersError: null,
  addProductCatalog: [],
  addProductCatalogLoading: false,
  addProductCatalogError: null,
  addProductSelectionLoading: false,
  error: null,
};

export const fetchCsOrders = createAsyncThunk(
  "customerSupport/fetchCsOrders",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching CS orders:", error.message);
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

/**
 * WP may return HTTP 404 + JSON { code: "no_orders", message: "..." } when the
 * list is empty — the route still exists. Treat that as success with zero rows.
 */
function emptyPaginatedOrdersPayload(apiUrl) {
  const qs = apiUrl.includes("?") ? apiUrl.split("?")[1] : "";
  const params = new URLSearchParams(qs);
  const page = parseInt(params.get("page") || "1", 10);
  const per_page = parseInt(params.get("per_page") || "100", 10);
  return {
    orders: [],
    pagination: {
      page,
      per_page,
      total_orders: 0,
      total_pages: 1,
    },
  };
}

export const fetchAccountOrders = createAsyncThunk(
  "customerSupport/fetchAccountOrders",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const code = data?.code;
      if (status === 404 && code === "no_orders") {
        return emptyPaginatedOrdersPayload(apiUrl);
      }
      console.error("Error fetching account orders:", error.message);
      return rejectWithValue(
        data?.message || error.message
      );
    }
  }
);

export const fetchCustomerSupportUsers = createAsyncThunk(
  "customerSupport/fetchCustomerSupportUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-users/v1/customer-support`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer support users:", error.message);
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const assignCsUser = createAsyncThunk(
  "customerSupport/assignCsUser",
  async ({ ticket_id, order_id, assign_user }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-cs/v1/assign-cs-user`,
        {
          ticket_id: Number(ticket_id),
          order_id: Number(order_id),
          assign_user: String(assign_user),
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to assign user";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

/**
 * POST `custom-cs-progress/v1/update-progress/` — CS order support.
 * `progress` may be empty when the UI collects only `note`.
 */
export const updateCsProgress = createAsyncThunk(
  "customerSupport/updateCsProgress",
  async ({ ticket_id, order_id, progress, note }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-cs-progress/v1/update-progress/`,
        {
          ticket_id: Number(ticket_id),
          order_id: Number(order_id),
          progress: String(progress ?? "").trim(),
          note: String(note ?? "").trim(),
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to update progress";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

export const fetchAddProductCatalog = createAsyncThunk(
  "customerSupport/fetchAddProductCatalog",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-ex-product/v1/add-product/`
      );
      return response.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Failed to load products";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

export const fetchAddProductByParams = createAsyncThunk(
  "customerSupport/fetchAddProductByParams",
  async ({ productId, variationId }, { rejectWithValue }) => {
    try {
      let url = `wp-json/custom-ex-product/v1/add-product/?product_id=${encodeURIComponent(
        productId
      )}`;
      if (variationId != null && variationId !== "") {
        url += `&variation_id=${encodeURIComponent(variationId)}`;
      }
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Failed to load product";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

export const calculateExchange = createAsyncThunk(
  "customerSupport/calculateExchange",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-order/v1/calculate-exchange`,
        payload
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to calculate exchange";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

/** Account CS: finalize product exchange (Finish Order). */
export const replaceProduct = createAsyncThunk(
  "customerSupport/replaceProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-order/v1/replace-product`,
        payload
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to replace product";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

/**
 * Account CS — Replace product modal Done.
 * POST body: order_id, ticket_id, product_id, variation_id (original line),
 * exc_item_id, exc_variation, exc_item_link (replacement), amount, balance_refund_amt,
 * extra_charged_amt, final_amount, category, module, status, payment_via.
 */
export const updateExchangeData = createAsyncThunk(
  "customerSupport/updateExchangeData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-cs-orders/v1/update-exchange-data`,
        payload
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to update exchange data";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

/**
 * Account CS — POST `custom-cs-orders/v1/proceed-refund/` (Finish Refund).
 * Doc: ticket_id, order_id, payment_via, acc_status, note, assign_user (text) +
 * paid_amt (text), charges (text), final_amt (text) + attachment (file) —
 * sent as multipart/form-data (file requires multipart).
 */
export const proceedRefund = createAsyncThunk(
  "customerSupport/proceedRefund",
  async (payload, { rejectWithValue }) => {
    try {
      const att = payload.attachment;
      if (!(att instanceof File)) {
        return rejectWithValue("Attachment image is required.");
      }
      const fd = new FormData();
      fd.append("ticket_id", String(payload.ticket_id));
      fd.append("order_id", String(payload.order_id));
      fd.append("payment_via", String(payload.payment_via ?? "").trim());
      fd.append("acc_status", String(payload.acc_status ?? "").trim());
      fd.append("note", String(payload.note ?? "").trim());
      fd.append("assign_user", String(payload.assign_user ?? "").trim());
      fd.append("paid_amt", String(payload.paid_amt ?? "").trim());
      fd.append("charges", String(payload.charges ?? "").trim());
      fd.append("final_amt", String(payload.final_amt ?? "").trim());
      fd.append("attachment", att, att.name);
      const response = await axiosInstance.post(
        `wp-json/custom-cs-orders/v1/proceed-refund/`,
        fd
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to proceed refund";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

/**
 * Exchange Finish — POST `wp-json/custom-finish-exorder/v1/finish-ex-order`.
 * Multipart: order_id, ticket_id, old/new product & variation ids, quantity,
 * `new_price` (legacy), `note`, `paid_amt`, `charges`, `final_amt`,
 * `attachment` (file).
 */
export const finishExOrder = createAsyncThunk(
  "customerSupport/finishExOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const att = payload.attachment;
      const isFile = att instanceof File;
      const note = String(payload.note ?? "").trim();
      const paid_amt = String(payload.paid_amt ?? "").trim();
      const charges = String(payload.charges ?? "").trim();
      const final_amt = String(payload.final_amt ?? "").trim();

      if (isFile) {
        const fd = new FormData();
        fd.append("order_id", String(payload.order_id));
        fd.append("ticket_id", String(payload.ticket_id));
        fd.append("old_product_id", String(Number(payload.old_product_id)));
        fd.append(
          "old_variation_id",
          String(Number(payload.old_variation_id ?? 0))
        );
        fd.append("new_product_id", String(Number(payload.new_product_id)));
        fd.append(
          "new_variation_id",
          String(Number(payload.new_variation_id ?? 0))
        );
        fd.append("quantity", String(Number(payload.quantity)));
        fd.append("new_price", String(Number(payload.new_price)));
        fd.append("note", note);
        fd.append("paid_amt", paid_amt);
        fd.append("charges", charges);
        fd.append("final_amt", final_amt);
        fd.append("attachment", att, att.name);
        const response = await axiosInstance.post(
          `wp-json/custom-finish-exorder/v1/finish-ex-order`,
          fd
        );
        return response.data;
      }

      const response = await axiosInstance.post(
        `wp-json/custom-finish-exorder/v1/finish-ex-order`,
        {
          order_id: Number(payload.order_id),
          ticket_id: Number(payload.ticket_id),
          old_product_id: Number(payload.old_product_id),
          old_variation_id: Number(payload.old_variation_id ?? 0),
          new_product_id: Number(payload.new_product_id),
          new_variation_id: Number(payload.new_variation_id ?? 0),
          quantity: Number(payload.quantity),
          new_price: Number(payload.new_price),
          note,
          paid_amt,
          charges,
          final_amt,
          attachment: String(payload.attachment ?? "").trim(),
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to finish order";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

/** CS: push ticket to account (`cs-to-account` — production + customer order support). */
export const pushCsToAccount = createAsyncThunk(
  "customerSupport/pushCsToAccount",
  async (
    { ticket_id, order_id, reason, note, category },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-cs-order-convert/v1/cs-to-account/${encodeURIComponent(
          String(ticket_id)
        )}`,
        { order_id, reason, note, category }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to push order to account";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

/** Account CS — POST `pay-link`: pay_link, final_amt, ext_charges (+ ticket/order). */
export const updatePayLink = createAsyncThunk(
  "customerSupport/updatePayLink",
  async (
    { ticket_id, order_id, pay_link, final_amt, ext_charges },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-cs-order-convert/v1/pay-link`,
        {
          ticket_id: Number(ticket_id),
          order_id: Number(order_id),
          pay_link: String(pay_link ?? "").trim(),
          final_amt: Number.isFinite(Number(final_amt))
            ? Number(final_amt)
            : 0,
          ext_charges: Number.isFinite(Number(ext_charges))
            ? Number(ext_charges)
            : 0,
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to update payment link";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

/** Production CS (`?cs=1&production=1`) — Push to CS modal. */
export const pushProductionCs = createAsyncThunk(
  "customerSupport/pushProductionCs",
  async ({ ticket_id, order_id, reason, note }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-production-cs/v1/push-cs/`,
        {
          ticket_id: Number(ticket_id),
          order_id: Number(order_id),
          reason: String(reason ?? "").trim(),
          note: String(note ?? "").trim(),
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to push to CS";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

/** Production CS: push order line to main / P2. */
export const pushProToMain = createAsyncThunk(
  "customerSupport/pushProToMain",
  async (
    {
      ticket_id,
      order_id,
      product_id,
      variation_id,
      reason,
      note,
      category,
      prod_time,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-pro-order-convert/v1/pro-to-main/${encodeURIComponent(
          String(ticket_id)
        )}`,
        {
          order_id,
          product_id,
          variation_id,
          reason,
          note,
          category,
          prod_time,
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to push to P2";
      return rejectWithValue(typeof msg === "string" ? msg : String(msg));
    }
  }
);

export const fetchProductionOrders = createAsyncThunk(
  "customerSupport/fetchProductionOrders",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const code = data?.code;
      if (status === 404 && code === "no_orders") {
        return emptyPaginatedOrdersPayload(apiUrl);
      }
      console.error("Error fetching production orders:", error.message);
      return rejectWithValue(
        data?.message || error.message
      );
    }
  }
);

/** CS Complete orders list — GET `custom-completed-orders/v1/cs-completed/`. */
export const fetchCsCompletedOrders = createAsyncThunk(
  "customerSupport/fetchCsCompletedOrders",
  async ({ apiUrl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const code = data?.code;
      if (status === 404 && code === "no_orders") {
        return emptyPaginatedOrdersPayload(apiUrl);
      }
      console.error("Error fetching CS completed orders:", error.message);
      return rejectWithValue(
        data?.message || error.message
      );
    }
  }
);

const customerSupportSlice = createSlice({
  name: "customerSupport",
  initialState,
  reducers: {
    clearCsOrdersState: (state) => {
      state.csOrders = [];
      state.csOrdersPagination = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCsOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCsOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.csOrders = action.payload?.orders ?? [];
        state.csOrdersPagination = action.payload?.pagination ?? null;
      })
      .addCase(fetchCsOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.csOrders = [];
        state.csOrdersPagination = null;
      })
      .addCase(fetchAccountOrders.pending, (state) => {
        state.isAccountOrdersLoading = true;
        state.accountOrdersError = null;
      })
      .addCase(fetchAccountOrders.fulfilled, (state, action) => {
        state.isAccountOrdersLoading = false;
        state.accountOrders = action.payload?.orders ?? [];
        state.accountOrdersPagination = action.payload?.pagination ?? null;
      })
      .addCase(fetchAccountOrders.rejected, (state, action) => {
        state.isAccountOrdersLoading = false;
        state.accountOrdersError = action.payload;
        state.accountOrders = [];
        state.accountOrdersPagination = null;
      })
      .addCase(fetchProductionOrders.pending, (state) => {
        state.isProductionOrdersLoading = true;
        state.productionOrdersError = null;
      })
      .addCase(fetchProductionOrders.fulfilled, (state, action) => {
        state.isProductionOrdersLoading = false;
        state.productionOrders = action.payload?.orders ?? [];
        state.productionOrdersPagination = action.payload?.pagination ?? null;
      })
      .addCase(fetchProductionOrders.rejected, (state, action) => {
        state.isProductionOrdersLoading = false;
        state.productionOrdersError = action.payload;
        state.productionOrders = [];
        state.productionOrdersPagination = null;
      })
      .addCase(fetchCsCompletedOrders.pending, (state) => {
        state.isCsCompletedOrdersLoading = true;
        state.csCompletedOrdersError = null;
      })
      .addCase(fetchCsCompletedOrders.fulfilled, (state, action) => {
        state.isCsCompletedOrdersLoading = false;
        state.csCompletedOrders = action.payload?.orders ?? [];
        state.csCompletedOrdersPagination = action.payload?.pagination ?? null;
      })
      .addCase(fetchCsCompletedOrders.rejected, (state, action) => {
        state.isCsCompletedOrdersLoading = false;
        state.csCompletedOrdersError = action.payload;
        state.csCompletedOrders = [];
        state.csCompletedOrdersPagination = null;
      })
      .addCase(fetchCustomerSupportUsers.pending, (state) => {
        state.customerSupportUsersLoading = true;
        state.customerSupportUsersError = null;
      })
      .addCase(fetchCustomerSupportUsers.fulfilled, (state, action) => {
        state.customerSupportUsersLoading = false;
        state.customerSupportUsers = action.payload?.users ?? [];
      })
      .addCase(fetchCustomerSupportUsers.rejected, (state, action) => {
        state.customerSupportUsersLoading = false;
        state.customerSupportUsersError = action.payload;
        state.customerSupportUsers = [];
      })
      .addCase(fetchAddProductCatalog.pending, (state) => {
        state.addProductCatalogLoading = true;
        state.addProductCatalogError = null;
      })
      .addCase(fetchAddProductCatalog.fulfilled, (state, action) => {
        state.addProductCatalogLoading = false;
        state.addProductCatalog = action.payload?.products ?? [];
      })
      .addCase(fetchAddProductCatalog.rejected, (state, action) => {
        state.addProductCatalogLoading = false;
        state.addProductCatalogError = action.payload;
        state.addProductCatalog = [];
      })
      .addCase(fetchAddProductByParams.pending, (state) => {
        state.addProductSelectionLoading = true;
      })
      .addCase(fetchAddProductByParams.fulfilled, (state) => {
        state.addProductSelectionLoading = false;
      })
      .addCase(fetchAddProductByParams.rejected, (state) => {
        state.addProductSelectionLoading = false;
      });
  },
});

export const { clearCsOrdersState } = customerSupportSlice.actions;
export default customerSupportSlice.reducer;
