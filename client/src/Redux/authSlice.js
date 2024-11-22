import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchCart, resetCartState } from "./cartSlice"; // Importa las acciones del carrito

const BASE_URL = "http://localhost:4002/api/v1/auth";
const CART_URL = "http://localhost:4002/cart";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const userResponse = await axios.post(`${BASE_URL}/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      var user = userResponse.data;

      // Crear carrito para el nuevo usuario
      const cartResponse = await axios.post(
        CART_URL,
        { userId: user.userId },
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );

      const cartId = cartResponse.data.Id;

      // Actualizar el estado global del carrito
      dispatch({
        type: "cart/updateCartId",
        payload: cartId,
      });

      return user;
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

      // Obtener carrito asociado al usuario
      dispatch(fetchCart(user.userId));

      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error al iniciar sesión.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
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
