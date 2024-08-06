import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import ShowAlert from "../../utils/ShowAlert";
import { API_URL } from "../../redux/constants/Constants";
import { saveToken, saveUserData } from "../../utils/StorageUtils";

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
      // Show confirmation alert
      // const result = await ShowAlert(
      //   'Do You Want to Log Out?',
      //   '',
      //   'question',
      //   true,
      //   true,
      //   'Confirm',
      //   'Cancel'
      // );

      // if (result.isConfirmed) {
        const res = await axios.post(
          `${API_URL}wp-json/custom-login/v1/logout`,
          null
        );
        localStorage.clear();
        // await ShowAlert(
        //   'Success',
        //   'You have been logged out successfully.',
        //   'success',
        //   false,
        //   false,
        //   'OK',
        //   '',
        //   1000
        // );

        return res.data; // Return response data for further handling if needed
      // } else {
      //   return rejectWithValue('Logout canceled');
      // }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    data: {},
  },
  reducers: {
    clearStore: (state) => {
      state.data = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.data;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.data = {};
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