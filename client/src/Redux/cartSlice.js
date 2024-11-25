import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/cart";

// Obtener el carrito
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}`);
      return response.data;
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
      return { productId, updatedProduct: response.data };
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
      return { productId, updatedProduct: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al decrementar la cantidad.");
    }
  }
);

// Eliminar un producto
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



export const finishCart = createAsyncThunk(
  "finishCart/finish",
  async ({ formData }, { getState, rejectWithValue }) => {
    const state = getState();
    const cartId = state.cart?.cartId; // Accede al cartId desde el estado global

    if (!cartId) {
      return rejectWithValue("No se encontró un cartId válido.");
    }

    // Agregar console.log para mostrar el cartId
    console.log("Cart ID utilizado para finalizar el carrito:", cartId);

    try {
      // Finalizar carrito
      console.log( formData);
      
      await axios.put(`${BASE_URL}/${cartId}/finish`, formData);

      
      
      

      return { success: true };
    } catch (err) {
      if (err.response?.status === 500) {
        console.warn("Se ignoró el error 500 al finalizar el carrito.");
        await axios.put(`${BASE_URL}/${cartId}/clear`);
        return { success: true, ignoredError: true }; // Indicar que se ignoró el error 500
      }

      const errorMessage = err.response?.data?.message || "Error desconocido al finalizar la compra";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cartId: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.cartId = null;
      state.error = null;
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
        state.items = action.payload.items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(incrementProductQuantity.fulfilled, (state, action) => {
  
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(decrementProductQuantity.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(finishCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(finishCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items = [];
        if (action.payload.ignoredError) {
          console.log("Finalización completada ignorando error 500.");
        }
      })
      .addCase(finishCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.productId !== action.payload);
      });
      
  },
});

export const { resetCartState } = cartSlice.actions;

export default cartSlice.reducer;
