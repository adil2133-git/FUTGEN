import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userCartKey = `cart_${user.id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (err) {
          console.error('Error loading cart from localStorage:', err);
        }
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userCartKey = `cart_${user.id}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    }
  }, [cart, user, isAuthenticated]);

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const price = priceString
      .toString()
      .replace(/Rs\.|₹|,/g, '')
      .replace(/\s+/g, '')
      .trim();
    return parseFloat(price) || 0;
  };

  const addToCart = (product, size = 'M', quantity = 1) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    setCart(prevCart => {
      const productId = product.id || product.product_id;
      const existingItemIndex = prevCart.findIndex(item => {
        const itemId = item.id || item.product_id;
        return itemId === productId && item.size === size;
      });

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        const newItem = {
          ...product,
          id: productId,
          size,
          quantity,
          cartId: `${productId}-${size}-${Date.now()}`
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parsePrice(item.price);
      return total + price * item.quantity;
    }, 0);
  };

  const getSubTotal = () => {
    return getCartTotal();
  };

  const getItemTotal = (item) => {
    const price = parsePrice(item.price);
    return price * item.quantity;
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId, size = 'M') => {
    return cart.some(item => {
      const itemId = item.id || item.product_id;
      return itemId === productId && item.size === size;
    });
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getSubTotal,
    getItemTotal,
    getCartItemCount,
    isInCart,
    parsePrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;