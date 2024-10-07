import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  currentPage: {},
  error: null,
};

const tableIds = [
  "ERManagement",
  "AllFactory",
  "MissingOrderSystem",
  "CompletedOrderSystem",
  "OnHoldOrdersSystem",
  "OrderSystem",
  "CompletedOrderSystemInChina",
  "OnHoldOrdersSystemInChina",
  "OrderSystemInChina",
  "OrderTrackingNumberPending",
  "ReserveOrderSystemInChina",
  "GRNManagement",
  "OrderManagementSystem",
  "POManagementSystem",
  "OrderNotAvailable",
  "GrnManagementOnOrderBasis",
];

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    startSyncLoading: (state) => {
      state.SyncLoading = true;
    },
    stopSyncLoading: (state) => {
      state.SyncLoading = false;
    },
    clearStoreData: (state, action) => {
      const { tableId } = action.payload;
      if (typeof state.currentPage !== "object") {
        state.currentPage = {};
      }
      state.isLoading = false;
      state.SyncLoading = false;
      tableIds.forEach((id) => {
        if (id !== tableId) delete state.currentPage[id];
      });
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      const { tableId, page } = action.payload;

      if (typeof state.currentPage !== "object") {
        state.currentPage = {};
      }

      tableIds.forEach((id) => {
        if (id !== tableId) delete state.currentPage[id];
      });

      if (!state.currentPage[tableId]) {
        state.currentPage[tableId] = 1;
      }

      state.currentPage[tableId] = page;
    },
  },
});

export const {
  clearStoreData,
  startSyncLoading,
  stopSyncLoading,
  setCurrentPage,
} = paginationSlice.actions;
export default paginationSlice.reducer;
