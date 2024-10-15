import React from "react";
import './App.css';
import Navigation from "./Navigation";
import Home from './Home';
import { Routes,Route } from "react-router-dom";

const App = () => {

  return(
    <>
    <Navigation />
      <Routes>
        <Route path='/' element={<Home/>}/>
        
      </Routes>
    </>
    
  )
}

export default App