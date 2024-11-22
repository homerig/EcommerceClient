import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/api/v1/auth";
const CART_URL = "http://localhost:4002/cart";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const userResponse = await axios.post(`${BASE_URL}/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      var user = userResponse.data;

      const cartResponse = await axios.post(
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


export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/authenticate`, { email, password });
      const data = response.data;
      const decodedToken = JSON.parse(atob(data.access_token.split('.')[1]));

      // Guardar datos en localStorage
      // localStorage.setItem('authToken', data.access_token);
      // localStorage.setItem('userId', data.userId);
      // localStorage.setItem('userName', data.name);
      // localStorage.setItem('userEmail', email);
      // localStorage.setItem('userRole', data.role);

      return { ...data, decodedToken };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Error al iniciar sesión.'
      );
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
  reducers: {},
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
