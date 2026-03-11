import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // { id, role, tokenBalance, email }
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    deductToken: (state) => {
      if (state.user && state.user.tokenBalance > 0) {
        state.user.tokenBalance -= 1;
      }
    },
  },
});

export const { loginSuccess, logout, deductToken } = authSlice.actions;
export default authSlice.reducer;
