import { createSlice } from "@reduxjs/toolkit";

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

const initialState = {
  user: JSON.parse(localStorage.getItem("authUser")) || null,
  role: localStorage.getItem("authRole") || null,
  isAuthenticated: !!localStorage.getItem("authUser"),
  lastLoginTime: JSON.parse(localStorage.getItem("lastLoginTime")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.lastLoginTime = Date.now();

      // Persist user data in localStorage
      localStorage.setItem("authUser", JSON.stringify(action.payload.user));
      localStorage.setItem("authRole", action.payload.role);
      localStorage.setItem("lastLoginTime", JSON.stringify(Date.now()));
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.lastLoginTime = null;

      // Clear localStorage
      localStorage.removeItem("authUser");
      localStorage.removeItem("authRole");
      localStorage.removeItem("lastLoginTime");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
export { SESSION_TIMEOUT };
