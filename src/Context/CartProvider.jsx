// CartProvider.js - Fixed Price Parsing
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

// Create Context
export const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Load cart from localStorage based on user
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

  // Save cart to localStorage whenever cart changes or user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const userCartKey = `cart_${user.id}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    }
  }, [cart, user, isAuthenticated]);

  // Improved price parsing function
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    
    // Handle different price formats: "Rs. 1,999.00", "₹1,999", "1,999.00", "1999"
    const price = priceString.toString()
      .replace(/Rs\.|₹|,/g, '') // Remove "Rs.", "₹" and commas
      .replace(/\s+/g, '') // Remove any whitespace
      .trim();
    
    return parseFloat(price) || 0;
  };

  // Add to cart function
  const addToCart = (product, size = 'M', quantity = 1) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    setCart(prevCart => {
      const productId = product.id || product.product_id;
      
      const existingItemIndex = prevCart.findIndex(
        item => {
          const itemId = item.id || item.product_id;
          return itemId === productId && item.size === size;
        }
      );
      
      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Item doesn't exist, add new item
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

  // Remove from cart
  const removeFromCart = (cartId) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  // Update cart quantity
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

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart total - Using improved price parsing
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parsePrice(item.price);
      return total + (price * item.quantity);
    }, 0);
  };

  // Get subtotal (same as total for now, but can be modified for discounts, etc.)
  const getSubTotal = () => {
    return getCartTotal();
  };

  // Get individual item total
  const getItemTotal = (item) => {
    const price = parsePrice(item.price);
    return price * item.quantity;
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if product is in cart
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
    getItemTotal, // Add this new function
    getCartItemCount,
    isInCart,
    parsePrice // Export for debugging if needed
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;