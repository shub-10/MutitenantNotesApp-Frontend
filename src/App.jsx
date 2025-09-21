import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Pages/Login.jsx'
import Home from "./Pages/Home";


function App() {
 
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/home" element={<Home></Home>}></Route>
      </Routes>
   </BrowserRouter>
  )
}

export default App
