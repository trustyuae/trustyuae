import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  factory: [],
  editFactory: [],
  addFactory: [],
  error: null,
};

export const fetchAllFactories = createAsyncThunk(
  "factory/getAllFactories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `wp-json/custom-factory/v1/fetch-factories/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const factoryEdit = createAsyncThunk(
  async ({ factoryId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-factory/v1/update-factory/${factoryId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating factory:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const FactoryAdd = createAsyncThunk(
  "factory/addFactory",
  async (factData, navigate, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-factory/v1/add-factory`,
        factData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await ShowAlert(
        "Success",
        response?.data?.message,
        "success",
        false,
        false,
        "OK",
        "",
        1000
      );
      return response.data;
    } catch (error) {
      console.error("Error adding factory:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const factorySlice = createSlice({
  name: "factory",
  initialState,
  reducers: {
    startSyncLoading: (state) => {
      state.SyncLoading = true;
    },
    stopSyncLoading: (state) => {
      state.SyncLoading = false;
    },
    clearstoredata: (state) => {
      (state.isLoading = false),
        (state.SyncLoading = false),
        (state.factory = []),
        (state.editFactory = []),
        (state.addFactory = []),
        (state.error = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFactories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFactories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.factory = action.payload;
      })
      .addCase(fetchAllFactories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(factoryEdit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(factoryEdit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editFactory = action.payload;
      })
      .addCase(factoryEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(FactoryAdd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FactoryAdd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addFactory = action.payload;
      })
      .addCase(FactoryAdd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
  factorySlice.actions;
export default factorySlice.reducer;
