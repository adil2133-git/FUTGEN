// App.js - Fixed Routes
import { useState } from 'react'
import './App.css'
import Registration from './Authentication/Registration'
import Login from './Authentication/Login'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import { AuthProvider } from './Context/AuthProvider'
import AllProduct from './Pages/AllProduct'
import DetailCard from './Pages/DetailCard'
import Cart from './Pages/Cart'
import { CartProvider } from './Context/CartProvider'
import Checkout from './Pages/Checkout' 
import Categories from './Pages/Categories'
import AboutUs from './Pages/AboutUs'

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <NavLink to={'/'}></NavLink>
            <NavLink to={'login'}></NavLink>
            <NavLink to={'signup'}></NavLink>
            <NavLink to={'product'}></NavLink>
            <NavLink to={'cart'}></NavLink>
            <NavLink to={'checkout'}></NavLink>
            <NavLink to={'categories'}></NavLink>
            <NavLink to={'category'}></NavLink>
            <NavLink to={'about'}></NavLink>
            <Routes>
              <Route path='/signup' element={<Registration />} />
              <Route path='/login' element={<Login />} />
              <Route path='/' element={<Home />} />
              <Route path='/product' element={<AllProduct />} />
              <Route path='/product/:productId' element={<DetailCard />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} /> 
              <Route path='/categories' element={<Categories />} />
              <Route path='/category/:categoryName' element={<Categories />} />
              <Route path='/about' element={<AboutUs />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App