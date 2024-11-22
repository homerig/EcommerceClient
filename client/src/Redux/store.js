import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categoriesSlice";
import userReducer from "./userSlice"; 
import ordersReducer from "./ordersSlice";
import productsReducer from "./productosSlice";
import catalogoReducer from "./catalogoSlice";
import authReducer from "./authSlice";
import cartReducer, { finishCart } from "./cartSlice";
import finishCartReducer from "./finishCartSlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    users: userReducer,  
    orders: ordersReducer,
    products: productsReducer,
    catalogo: catalogoReducer,
    auth: authReducer,
    cart: cartReducer,
    finishCart: finishCartReducer,
  },
});
