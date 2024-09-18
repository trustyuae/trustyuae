import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { saveToken, saveUserData } from "../../utils/StorageUtils";


const initialState = {
  isLoading: false,
  SyncLoading: false,
  loginData: [],
  logoutData: [],
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}wp-json/custom-login/v1/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await saveToken(res.data.token);
      await saveUserData(res.data.user_data);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
        const res = await axios.post(
          `${API_URL}wp-json/custom-login/v1/logout`,
          null
        );
        localStorage.clear();
        return res.data; // Return response data for further handling if needed
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startSyncLoading: (state) => {
      state.SyncLoading = true;
    },
    stopSyncLoading: (state) => {
      state.SyncLoading = false;
    },
    clearstoredata: (state) => {
      (state.isLoading = false);
        (state.SyncLoading = false);
        (state.loginData = []);
        (state.logoutData = []);
        (state.error = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loginData = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state,action) => {
        state.isLoading = false;
        state.logoutData = action.payload;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearStore } = userSlice.actions;

export default userSlice.reducer;


export const loginUserWithToken = (navigate, token) => async (dispatch) => {
    if (token) {
      navigate("/ordersystem");
    } else {
      navigate("/");
    }
  };