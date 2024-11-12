import { configureStore } from "@reduxjs/toolkit";
import productoReducer from "./productosSlice";
import categoryReducer from "./categoriesSlice";

export const store = configureStore({
  reducer: {
    productos: productoReducer,
    categories: categoryReducer,
  },
});
