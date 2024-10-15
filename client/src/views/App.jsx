import React from "react";
import './App.css';
import Navigation from "./Navigation";
import Home from './Home';
import Products from "./Products";
import Login from "./Login";
import ProductsAdmin from './adminViews/ProductsAdmin';
import Users from './adminViews/Users';
import Orders from './adminViews/Orders';

import { Routes,Route } from "react-router-dom";

const App = () => {

  return(
    <>
    <Navigation />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Products' element={<Products/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path="/adminViews/ProductsAdmin" element={<ProductsAdmin/>}/>
        <Route path="/adminViews/Users" element={<Users/>}/>
        <Route path="/adminViews/Orders" element={<Orders/>}/>
      </Routes>
    </>
    
  )
}

export default App