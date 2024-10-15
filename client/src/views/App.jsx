import React from "react";
import './App.css';
import Navigation from "./Navigation";
import Home from './Home';
import Products from "./Products";
import Login from "./Login";
import { Routes,Route } from "react-router-dom";

const App = () => {

  return(
    <>
    <Navigation />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Products' element={<Products/>}/>
        <Route path='/Login' element={<Login/>}/>
        
      </Routes>
    </>
    
  )
}

export default App