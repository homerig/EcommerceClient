import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/api/v1/auth";
const CART_URL = "http://localhost:4002/cart";

// Acción para registrar un usuario
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const userResponse = await axios.post(`${BASE_URL}/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      const user = userResponse.data;

      await axios.post(
        CART_URL,
        { userId: user.userId },
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );

      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error inesperado");
    }
  }
);

// Acción para iniciar sesión
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/authenticate`, {
        email,
        password,
      });
      const data = response.data;
      const decodedToken = JSON.parse(atob(data.access_token.split(".")[1]));

      // Guardar datos en localStorage
      const userData = { ...data, decodedToken };
      localStorage.setItem("user", JSON.stringify(userData)); // Guardar usuario

      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error al iniciar sesión."
      );
    }
  }
);

// Recuperar usuario de localStorage al cargar la app
const savedUser = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser || null, // Recuperar usuario desde localStorage
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
        localStorage.setItem("user", JSON.stringify(action.payload)); // Guardar usuario al registrarse
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
