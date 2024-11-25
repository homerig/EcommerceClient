import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL_Catalog = "http://localhost:4002/catalogo/products";
const BASE_URL_Products = "http://localhost:4002/products";


export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const { data } = await axios.get(BASE_URL_Catalog);
  return data;
});


export const fetchFinalPrice = createAsyncThunk(
  "products/fetchFinalPrice",
  async (productId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.login?.user?.access_token; 

    if (!token) {
      return rejectWithValue("Usuario no autenticado. No se puede obtener el precio final.");
    }

    try {
      const { data } = await axios.get(`${BASE_URL_Products}/${productId}/final-price`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { productId, finalPrice: data };
    } catch (error) {
      console.error("Error al obtener el precio final:", error);
      return rejectWithValue(error.response?.data || "Error desconocido");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const state = getState(); 
      const token = state.auth?.user?.access_token; 
      const { data } = await axios.post(BASE_URL_Products, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);
      return data;
    } catch (error) {
      debugger;
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { getState, rejectWithValue }) => {
    try {
      const state = getState(); 
      const token = state.auth?.user?.access_token; 
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


export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id, { getState }) => {
  const state = getState(); 
  const token = state.auth?.user?.access_token; 
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
