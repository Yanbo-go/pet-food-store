import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./slice/messageSlice";
import couponReducer from "./slice/couponSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    coupon: couponReducer,
  },
});
