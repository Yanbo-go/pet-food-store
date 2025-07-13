import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiPath = process.env.REACT_APP_APT_PATH;

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    code: null,
    final_total: null,
    message: null,
    success: false,
  },
  reducers: {
    setCoupon: (state, action) => {
      if (action.payload.success) {
        state.code = action.payload.code;
        state.final_total = action.payload.final_total;
        state.message = action.payload.message;
        state.success = action.payload.success;
      } else {
        state.message = action.payload.message;
        state.success = action.payload.success;
      }
    },
    removeCoupon: (state, action) => {
      state.code = action.payload.code;
      state.final_total = action.payload.final_total;
      state.message = action.payload.message;
      state.success = action.payload.success;
    },
    removeMessage: (state, action) => {
      state.message = "";
    },
  },
});

export const applyCoupon = createAsyncThunk(
  "coupon/checkCoupon",
  async (code, { dispatch }) => {
    const data = {
      data: {
        code: code,
      },
    };
    try {
      const res = await axios.post(`/v2/api/${apiPath}/coupon`, data);
      dispatch(
        couponSlice.actions.setCoupon({
          code: code,
          final_total: res.data.data.final_total,
          message: res.data.message,
          success: res.data.success,
        })
      );
    } catch (error) {
      const res = error.response;
      dispatch(
        couponSlice.actions.setCoupon({
          message: res.data.message,
          success: res.data.success,
        })
      );
    } finally {
      setTimeout(() => {
        dispatch(couponSlice.actions.removeMessage());
      }, 3000);
    }
  }
);

export const clearCoupon = createAsyncThunk(
  "coupon/checkCoupon",
  async function (message, { dispatch }) {
    dispatch(
      couponSlice.actions.removeCoupon({
        code: null,
        final_total: null,
        message: message,
        success: false,
      })
    );
    setTimeout(() => {
      dispatch(couponSlice.actions.removeMessage());
    }, 3000);
  }
);

export const { setCoupon, removeCoupon, removeMessage } = couponSlice.actions;
export default couponSlice.reducer;
