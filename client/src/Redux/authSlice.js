import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Endpoint base para la autenticación
const BASE_URL = "http://localhost:4002/api/v1/auth";
const CART_URL = "http://localhost:4002/cart"; // URL para crear el carrito

// Acción asíncrona para registrar un nuevo usuario y crear un carrito
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      // Solicitud para registrar al usuario
      const userResponse = await axios.post(`${BASE_URL}/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      const { access_token, userId } = userResponse.data;

      // Guarda el token y el userId en localStorage
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("userId", userId);

      // Crear un carrito para el usuario registrado
      const cartResponse = await axios.post(
        CART_URL,
        { userId }, // Asegúrate de que el backend espera este formato
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      return { userId, cart: cartResponse.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error inesperado");
    }
  }
);

// Slice para manejar la autenticación
const authSlice = createSlice({
  name: "auth",
  initialState: { userId: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
