import { useState } from 'react'
import './App.css'
import Registration from './Authentication/Registration'
import Login from './Authentication/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import { AuthProvider } from './Context/AuthProvider'
import AllProduct from './Pages/AllProduct'
import DetailCard from './Pages/DetailCard'
import Cart from './Pages/Cart'
import { CartProvider } from './Context/CartProvider'
import Checkout from './Pages/Checkout'
import Categories from './Pages/Categories'
import AboutUs from './Pages/AboutUs'
import ContactUs from './Pages/ContactUs'
import Navlink from './Components/Navlink'
import OrderManagement from './Admin/Pages/OrderManagement'
import ProductManagement from './Admin/Pages/ProductManagement'
import UserManagement from './Admin/Pages/UserManagement'
import AdminHome from './Admin/Pages/AdminHome'
import YourOrders from './Pages/YourOrders'
import { WishlistProvider } from './Context/WishlistProvider'
import Wishlist from './Pages/Wishlist'
import AdminRoute from './Components/AdminRoute'

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Navlink />
              <Routes>
                <Route path='/signup' element={<Registration />} />
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<Home />} />
                <Route path='/product' element={<AllProduct />} />
                <Route path='/product/:productId' element={<DetailCard />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/orders' element={<YourOrders />} />
                <Route path='/categories' element={<Categories />} />
                <Route path='/category/:categoryName' element={<Categories />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/contact' element={<ContactUs />} />

                <Route element={<AdminRoute />}>
                  <Route path='/admin/home' element={<AdminHome />} />
                  <Route path='/admin/order' element={<OrderManagement />} />
                  <Route path='/admin/product' element={<ProductManagement />} />
                  <Route path='/admin/user' element={<UserManagement />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App