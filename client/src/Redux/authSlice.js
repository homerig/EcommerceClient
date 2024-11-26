import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchCart, resetCartState } from "./cartSlice"; 

const BASE_URL = "http://localhost:4002/api/v1/auth";
const CART_URL = "http://localhost:4002/cart";

const savedUser = JSON.parse(localStorage.getItem("user")) || null;

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData1, { rejectWithValue }) => {
    try {
      const userResponse = await axios.post(`${BASE_URL}/register`, userData1, {
        headers: { "Content-Type": "application/json" },
      });

      const user = userResponse.data;

      await axios.post(
        CART_URL,
        { userId: user.userId },
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );

      const cartResponse = await axios.get(`http://localhost:4002/cart/user/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });

      const cartId = cartResponse.data.id;
      

      const userData = { ...user, cartId };
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error inesperado");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${BASE_URL}/authenticate`, { email, password });
      const user = response.data;

      const cartResponse = await axios.get(`http://localhost:4002/cart/user/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });

      const cartId = cartResponse.data.id;

      const userData = { ...user, cartId };
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error al iniciar sesión.");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser, 
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
