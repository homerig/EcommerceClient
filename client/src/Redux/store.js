import { configureStore } from "@reduxjs/toolkit";
import productoReducer from "./productosSlice";

export const store = configureStore({
  reducer: {
    productos: postReducer,
  },
});
