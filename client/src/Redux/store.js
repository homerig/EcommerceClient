import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categoriesSlice";
import userReducer from "./userSlice"; 

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    users: userReducer,  
  },
});
