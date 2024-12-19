import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("authUser")) || null,
  role: localStorage.getItem("authRole") || null,
  isAuthenticated: !!localStorage.getItem("authUser"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      // Persist user data in localStorage
      localStorage.setItem("authUser", JSON.stringify(action.payload.user));
      localStorage.setItem("authRole", action.payload.role);
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("authUser");
      localStorage.removeItem("authRole");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
