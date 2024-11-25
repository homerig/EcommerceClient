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

    try {
      await axios.put(`${BASE_URL}/${cartId}/finish`, formData);

      await axios.put(`${BASE_URL}/${cartId}/clear`);

      return cartId;
      
    } catch (err) {
      console.error("Error detectado:", err);
    
      if (err.response) {
        console.error("Detalles de la respuesta del error:", err.response);
      } else if (err.request) {
        console.error("No hubo respuesta del servidor:", err.request);
      } else {
        console.error("Error durante la configuración de la solicitud:", err.message);
      }
    
      if (err.response?.status === 500) {
        try {
          return { success: true, ignoredError: true };
        } catch (clearError) {
          console.error("Error al intentar limpiar el carrito:", clearError);
          return rejectWithValue("Error al intentar limpiar el carrito.");
        }
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
        console.log("Finalizando carrito: pendiente...");
        state.loading = true;
        state.error = null;
      })
      .addCase(finishCart.fulfilled, (state, action) => {
        console.log("Finalizando carrito: éxito", action.payload);
        state.loading = false;
        state.success = true;
        state.items = [];
      })
      .addCase(finishCart.rejected, (state, action) => {
        console.error("Finalizando carrito: error", action.payload || action.error.message);
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
