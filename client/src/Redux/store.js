import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categoriesSlice";
import userReducer from "./userSlice"; 
import ordersReducer from "./ordersSlice";
import productsReducer from "./productosSlice";
<<<<<<< HEAD
import catalogoReducer from "./catalogoSlice";

=======
import authReducer from "./authSlice";
>>>>>>> main

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    users: userReducer,  
    orders: ordersReducer,
    products: productsReducer,
<<<<<<< HEAD
    catalogo: catalogoReducer,
=======
    auth: authReducer,
>>>>>>> main
  },
});
