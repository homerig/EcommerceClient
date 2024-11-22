// Redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/users";


export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { getState }) => {
  const state = getState(); 
  const token = state.auth?.user?.access_token; 
  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
});


export const updateUser = createAsyncThunk("users/updateUser", async ({ id, userData }, { getState }) => {
  const state = getState(); 
  const token = state.auth?.user?.access_token; 
  const response = await axios.put(`${BASE_URL}/${id}`, userData, {
    
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
});


export const deleteUser = createAsyncThunk("users/deleteUser", async (id, { getState }) => {
  const state = getState(); 
  const token = state.auth?.user?.access_token; 
  await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return id;
});


export const fetchUserOrders = createAsyncThunk("users/fetchUserOrders", async (userId, { getState }) => {
  const state = getState(); 
  const token = state.auth?.user?.access_token; 
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
