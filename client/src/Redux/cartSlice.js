import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/cart";

// Acciones asíncronas

// Obtener el carrito y los productos del usuario
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth?.user?.access_token;

      const response = await axios.get(`${BASE_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data; // Retorna el carrito completo
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al cargar el carrito.");
    }
  }
);

// Incrementar la cantidad de un producto
export const incrementProductQuantity = createAsyncThunk(
  "cart/incrementProductQuantity",
  async ({ cartId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/incOne`, null, {
        params: { cartId, productId },
      });
      return response.data; // Devuelve el producto actualizado
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al incrementar la cantidad.");
    }
  }
);

// Decrementar la cantidad de un producto
export const decrementProductQuantity = createAsyncThunk(
  "cart/decrementProductQuantity",
  async ({ cartId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/decOne`, null, {
        params: { cartId, productId },
      });
      return response.data; // Devuelve el producto actualizado
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al decrementar la cantidad.");
    }
  }
);

// Eliminar un producto del carrito
export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async ({ cartId, productId }, { rejectWithValue }) => {
    try {
      await axios.put(`${BASE_URL}/remove-product`, null, {
        params: { cartId, productId },
      });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al eliminar el producto.");
    }
  }
);

// Finalizar el carrito
export const finishCart = createAsyncThunk(
  "cart/finishCart",
  async ({ cartId }, { rejectWithValue }) => {
    try {
      await axios.put(`${BASE_URL}/${cartId}/finish`);
      return "Carrito finalizado con éxito.";
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al finalizar el carrito.");
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // Productos en el carrito
    cartId: null, // ID del carrito
    loading: false, // Estado de carga
    error: null, // Mensaje de error
  },
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
        state.cartId = action.payload.id; // ID del carrito
        state.items = action.payload.items; // Productos del carrito
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(incrementProductQuantity.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const item = state.items.find((i) => i.productId === updatedProduct.productId);
        if (item) item.quantity = updatedProduct.quantity;
      })
      .addCase(decrementProductQuantity.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const item = state.items.find((i) => i.productId === updatedProduct.productId);
        if (item) item.quantity = updatedProduct.quantity;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.productId !== action.payload);
      })
      .addCase(finishCart.fulfilled, (state) => {
        state.items = [];
        state.cartId = null;
      });
  },
});

export const { resetCartState, updateCartId } = cartSlice.actions;

export default cartSlice.reducer;
