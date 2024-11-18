
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/categories";
const token = localStorage.getItem("authToken");

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

export const createCategory = createAsyncThunk("categories/createCategory", async ({ description }) => {
  try {
    const response = await axios.post(
      BASE_URL, 
      { description }, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al hacer la solicitud:", error.response?.data || error.message);
    throw error;
  }
});


export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ categoryId, description }) => {
    const response = await axios.put(
      `${BASE_URL}/${categoryId}`,
      { description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (categoryId) => {
  await axios.delete(`${BASE_URL}/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return categoryId;
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((cat) => cat.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default categoriesSlice.reducer;
