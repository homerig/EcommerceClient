import React from "react";
import './css/App.css';
import Navigation from "./Navigation";
import Home from './Home';
import Products from "./Products";
import Login from "./Login";
import ViewCart from "./ViewCart";
import Users from "./Users";
import Register from "./Register";

import ProductsAdmin from './adminViews/ProductsAdmin';

import { Routes,Route } from "react-router-dom";

const App = () => {

  return(
    <>
    <Navigation />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Products' element={<Products/>}/>
        <Route path='/Users' element={<Users/>}/>
        <Route path='/Login' element={<Login/>}/>

        <Route path='/Register' element={<Register/>}/>
        <Route path='/ViewCart' element={<ViewCart/>}/>
        <Route path="/adminViews/ProductsAdmin" element={<ProductsAdmin/>}/>

      </Routes>
    </>
    
  )
}

export default App