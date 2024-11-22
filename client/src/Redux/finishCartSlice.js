import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/cart";

// Thunks
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
      await axios.put(`${BASE_URL}/${cartId}/finish`, formData);

      // Vaciar carrito
      await axios.put(`${BASE_URL}/${cartId}/clear`);

      return { success: true };
    } catch (err) {
      if (err.response?.status === 500) {
        console.warn("Se ignoró el error 500 al finalizar el carrito.");
        return { success: true, ignoredError: true }; // Indicar que se ignoró el error 500
      }

      const errorMessage = err.response?.data?.message || "Error desconocido al finalizar la compra";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const finishCartSlice = createSlice({
  name: "finishCart",
  initialState: { loading: false, error: null, success: false },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(finishCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(finishCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.ignoredError) {
          console.log("Finalización completada ignorando error 500.");
        }
      })
      .addCase(finishCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetState } = finishCartSlice.actions;
export default finishCartSlice.reducer;
