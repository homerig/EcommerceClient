import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/cart";
const PRODUCTS_URL = "http://localhost:4002/products";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth?.user?.access_token;

      const response = await axios.get(`${BASE_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const cart = response.data;

      if (response.data?.items) {
        const itemsWithDetails = await Promise.all(
          response.data.items.map(async (item) => {
            const productResponse = await axios.get(`${PRODUCTS_URL}/${item.productId}`);
            return {
              ...item,
              productName: productResponse.data.name,
              productPrice: productResponse.data.price,
              productImage: productResponse.data.images[0] || null,
            };
          })
        );
        return { ...response.data, items: itemsWithDetails, cart };
      }

      return response.data;
    } catch (error) {
      return rejectWithValue("Error al cargar el carrito.");
    }
  }
);

export const incrementProductQuantity = createAsyncThunk(
  "cart/incrementProductQuantity",
  async ({ cartId, productId }) => {
    await axios.put(`${BASE_URL}/incOne?cartId=${cartId}&productId=${productId}`);
    return productId;
  }
);

export const decrementProductQuantity = createAsyncThunk(
  "cart/decrementProductQuantity",
  async ({ cartId, productId }) => {
    await axios.put(`${BASE_URL}/decOne?cartId=${cartId}&productId=${productId}`);
    return productId;
  }
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async ({ cartId, productId }) => {
    await axios.put(`${BASE_URL}/remove-product?cartId=${cartId}&productId=${productId}`);
    return productId;
  }
);

export const finishCart = createAsyncThunk(
  "cart/finishcart",
  async ({ cartId}) => {
    await axios.put(`${BASE_URL}/${cartId}/finish`);
    return finalprice;
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], cartId: null, loading: false, error: null },
  reducers: {
    updateCartId: (state, action) => {
      state.cartId = action.payload;
    },
    resetCartState: (state) => {
      state.items = [];
      state.cartId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload.id;
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(incrementProductQuantity.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.productId === action.payload);
        if (item) item.quantity += 1;
      })
      .addCase(decrementProductQuantity.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.productId === action.payload);
        if (item) item.quantity -= 1;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.productId !== action.payload);
      });
  },
});

export const { updateCartId, resetCartState } = cartSlice.actions;

export default cartSlice.reducer;