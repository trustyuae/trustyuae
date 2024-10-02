import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import ShowAlert from "../../utils/ShowAlert";

const initialState = {
  isLoading: false,
  SyncLoading: false,
  factories: [],
  factoriesWithParams: [],
  editFactory: [],
  addFactory: [],
  factoryStatus: [],
  error: null,
};

export const fetchAllFactories = createAsyncThunk(
  "factory/fetchAllFactories",
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

export const fetchFactoriesByFilterParam = createAsyncThunk(
  "factory/fetchFactoriesByFilterParam",
  async ({ apiUrl, params }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl, { params });
      return response.data; // Ensure response.data has the expected structure
    } catch (error) {
      console.error("Error fetching factories:", error.message);
      return rejectWithValue(error.response?.data || error.message); // Provide more detailed error information if available
    }
  }
);


export const factoryEdit = createAsyncThunk(
  "factory/factoryEdit",
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
  "factory/FactoryAdd",
  async (factData,{ rejectWithValue }) => {
    console.log(factData,'factData from Factory Add')
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
      return response.data;
    } catch (error) {
      console.error("Error adding factory:", error.message);
      return rejectWithValue(error.message);
    }
  }
);


export const FactoryStatus = createAsyncThunk(
  "factory/FactoryStatus",
  async (id,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `wp-json/custom-factory-active/v1/active-factory/${id}`,
      );
      return response;
    } catch (error) {
      console.error("Error changing factory Status:", error.message);
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
      state.isLoading = false;
      state.SyncLoading = false;
      state.factories = [];
      state.factoriesWithParams = [];
      state.editFactory = [];
      state.addFactory = [];
      state.factoryStatus = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFactories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFactories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.factories = action.payload;
      })
      .addCase(fetchAllFactories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFactoriesByFilterParam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFactoriesByFilterParam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.factoriesWithParams = action.payload;
      })
      .addCase(fetchFactoriesByFilterParam.rejected, (state, action) => {
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
      })
      .addCase(FactoryStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FactoryStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.factoryStatus = action.payload;
      })
      .addCase(FactoryStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearstoredata, startSyncLoading, stopSyncLoading } =
  factorySlice.actions;
export default factorySlice.reducer;
