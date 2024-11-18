import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4002/api/v1/auth/authenticate';

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(BASE_URL, { email, password });
      const data = response.data;

      // Decodificar el token JWT
      const decodedToken = JSON.parse(atob(data.access_token.split('.')[1]));

      // Guardar datos en localStorage
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', data.role);

      return { ...data, decodedToken };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Error al iniciar sesión.'
      );
    }
  }
);

// **Slice de Login**
const loginSlice = createSlice({
  name: 'login',
  initialState: {
    user: null,
    token: null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.name;
        state.token = action.payload.access_token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
