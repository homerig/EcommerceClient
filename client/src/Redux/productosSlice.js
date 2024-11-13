import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/catalogo/products";
const token = localStorage.getItem("authToken");

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const { data } = await axios.get(BASE_URL);
  return data.slice(0, 6); // Limita la lista a 6 productos, según tu código original
});

export const fetchFinalPrice = createAsyncThunk(
  "products/fetchFinalPrice",
  async (productId) => {
    const { data } = await axios.get(`${BASE_URL}/${productId}/final-price`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { productId, finalPrice: data };
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    finalPrices: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFinalPrice.fulfilled, (state, action) => {
        const { productId, finalPrice } = action.payload;
        state.finalPrices[productId] = finalPrice;
      });
  },
});

export default productsSlice.reducer;