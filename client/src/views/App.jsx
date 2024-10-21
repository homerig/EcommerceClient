import React from "react";
import './css/App.css';
import Navigation from "./Navigation";
import Home from './Home';
import Products from "./Products";
import Login from "./Login";
import ViewCart from "./ViewCart";
import ViewUsers from "./ViewUsers";
import Register from "./Register";
import ViewProduct from "./ViewProduct";
import ProductsAdmin from './adminViews/ProductsAdmin';
import Orders from './adminViews/Orders';
import Categories from "./Categories";


import { Routes,Route } from "react-router-dom";

const App = () => {

  return(
    <>
    <Navigation />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Products' element={<Products/>}/>
        <Route path='/ViewUsers' element={<ViewUsers/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Orders' element={<Orders/>}/>
       

        <Route path='/Register' element={<Register/>}/>
        <Route path='/ViewCart' element={<ViewCart/>}/>
        <Route path='/ViewProduct/:id' element={<ViewProduct/>}/>
        <Route path="/adminViews/ProductsAdmin" element={<ProductsAdmin/>}/>
        <Route path='/Categories' element={<Categories/>}/>

      </Routes>
    </>
    
  )
}

export default App