import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categoriesSlice";
import userReducer from "./userSlice";  // Importa el slice de usuarios

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    users: userReducer,  // Añade el slice de usuarios bajo la clave `users`
  },
});
