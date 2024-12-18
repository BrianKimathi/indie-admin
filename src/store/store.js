import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer, // Add your auth slice
  },
});

export default store;
