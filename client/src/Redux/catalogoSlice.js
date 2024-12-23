import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/catalogo";

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

export const agregarAlCarrito = createAsyncThunk("catalogo/agregarAlCarrito", async (producto, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth?.user?.access_token;
  const userId = state.auth?.user?.userId;
  const cartId = state.cart?.cartId;

  try {
    let cartResponse = await axios.get(`http://localhost:4002/cart/user/${userId}`);

    if (cartResponse.status === 404) {
      const createResponse = await axios.post(`http://localhost:4002/cart`, { userId });
      cartResponse = createResponse;
    }
    const existingProductInCart = cartResponse.data.items.find(item => item.productId === producto.id);
    const currentQuantityInCart = existingProductInCart ? existingProductInCart.quantity : 0;
    if (currentQuantityInCart + 1 > producto.stock) {
      return rejectWithValue("No puedes agregar más unidades de este producto. Stock insuficiente.");
    }
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

    return producto;

  } catch (error) {
    return rejectWithValue(error.response?.data || "Error al agregar el producto al carrito.");
  }
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
        if (action.payload?.warning) {
          state.error = action.payload.warning; 
        } else {
          const updatedProduct = action.payload;
          if (updatedProduct && updatedProduct.id) {
            const productIndex = state.productos.findIndex(
              (producto) => producto.id === updatedProduct.id
            );
            if (productIndex !== -1) {
              state.productos[productIndex].quantity =
                (state.productos[productIndex].quantity || 0) + 1;
            }
          }
        }
      })
      .addCase(agregarAlCarrito.rejected, (state, action) => {
        console.log(action.payload);
                if (action.payload) {

          state.error = action.payload;
        } else {
          state.error = action.payload || "Error al agregar el producto al carrito.";
        }
      });
  },
});

export default catalogoSlice.reducer;
