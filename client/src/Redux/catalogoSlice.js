// Redux/CatalogoSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/catalogo";
const token = localStorage.getItem("authToken");

export const fetchProducts = createAsyncThunk("catalogo/fetchProducts", async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
});

export const fetchCategories = createAsyncThunk("catalogo/fetchCategories", async () => {
  const response = await axios.get("http://localhost:4002/categories");
  return response.data;
});

export const filterByCategory = createAsyncThunk("catalogo/filterByCategory", async (categoryId) => {
  const response = await axios.get(`${BASE_URL}/products/by-category/${categoryId}`);
  return response.data;
});

export const filterByPrice = createAsyncThunk("catalogo/filterByPrice", async ({ min, max }) => {
  const response = await axios.get(`${BASE_URL}/filter-by-price`, {
    params: { minPrice: min, maxPrice: max },
  });
  return response.data;
});

export const agregarAlCarrito = createAsyncThunk("catalogo/agregarAlCarrito", async (producto) => {
  const userId = localStorage.getItem("userId");
  let cartResponse = await axios.get(`http://localhost:4002/cart/user/${userId}`);

  if (cartResponse.status === 404) {
    const createResponse = await axios.post(`http://localhost:4002/cart`, { userId });
    cartResponse = createResponse;
  }

  const cartId = cartResponse.data.id;
  await axios.put(`${BASE_URL}/${cartId}/add-product`, {
    cartId,
    productId: producto.id,
    quantity: 1,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  alert('Producto agregado al carrito');

  return producto;
});

const catalogoSlice = createSlice({
  name: "catalogo",
  initialState: {
    productos: [],
    categorias: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categorias = action.payload;
      })
      .addCase(filterByCategory.fulfilled, (state, action) => {
        state.productos = action.payload;
      })
      .addCase(filterByPrice.fulfilled, (state, action) => {
        state.productos = action.payload;
      })
      .addCase(agregarAlCarrito.fulfilled, (state, action) => {
        // Lógica para agregar el producto al carrito localmente si es necesario
      });
  },
});

export default catalogoSlice.reducer;
