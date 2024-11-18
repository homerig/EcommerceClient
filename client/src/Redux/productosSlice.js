import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL_Catalog = "http://localhost:4002/catalogo/products";
const BASE_URL_Products = "http://localhost:4002/products";

const token = localStorage.getItem("authToken");

// Acción para obtener los productos
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const { data } = await axios.get(BASE_URL_Catalog);
  return data;
});

// Acción para obtener el precio final
export const fetchFinalPrice = createAsyncThunk(
  "products/fetchFinalPrice",
  async (productId) => {
    const { data } = await axios.get(`${BASE_URL_Products}/${productId}/final-price`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { productId, finalPrice: data };
  }
);
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(BASE_URL_Products, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${BASE_URL_Products}/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating product");
    }
  }
);


export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id) => {
  await axios.delete(`${BASE_URL_Products}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    finalPrices: {},
    loading: true,
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
        state.loading = false;
        const { productId, finalPrice } = action.payload;
        state.finalPrices[productId] = finalPrice;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...state.items, action.payload];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })          
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = 'No se puede eliminar un producto que esta agregado a un carrito.';
      });
  },
});

export default productsSlice.reducer;
