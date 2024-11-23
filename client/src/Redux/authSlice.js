import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchCart, resetCartState } from "./cartSlice"; // Importa las acciones del carrito

const BASE_URL = "http://localhost:4002/api/v1/auth";
const CART_URL = "http://localhost:4002/cart";

// Recuperar usuario de localStorage al cargar la app
const savedUser = JSON.parse(localStorage.getItem("user")) || null;

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const userResponse = await axios.post(`${BASE_URL}/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      const user = userResponse.data;

      // Crear carrito para el nuevo usuario
      await axios.post(
        CART_URL,
        { userId: user.userId },
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );

      // Guardar usuario en localStorage
      localStorage.setItem("user", JSON.stringify(user));

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
      const cartResponse = await axios.get(`http://localhost:4002/cart/user/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });

      const cartId = cartResponse.data.id;

      // Guardar usuario y cartId en localStorage
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
    user: savedUser, // Cargar usuario desde localStorage
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Limpiar localStorage al cerrar sesión
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
