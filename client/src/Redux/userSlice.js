// Redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/users";
const token = localStorage.getItem("authToken");

// Thunk para obtener usuarios
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
});

// Thunk para actualizar un usuario
export const updateUser = createAsyncThunk("users/updateUser", async ({ id, userData }) => {
  const response = await axios.put(`${BASE_URL}/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
});

// Thunk para eliminar un usuario
export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return id;
});

// Thunk para obtener las órdenes de un usuario
export const fetchUserOrders = createAsyncThunk("users/fetchUserOrders", async (userId) => {
  const response = await axios.get(`http://localhost:4002/order/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { userId, orders: response.data };
});

const userSlice = createSlice({
  name: "users",
  initialState: { items: [], loading: false, error: null, orders: {} },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.items.findIndex(user => user.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(user => user.id !== action.payload);
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders[action.payload.userId] = action.payload.orders;
      });
  }
});

export default userSlice.reducer;
