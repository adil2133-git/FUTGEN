import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../Api/Axios';
import Navbar from '../Components/Navbar';
import { useCart } from '../Context/CartProvider';

function DetailCard() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, isInCart } = useCart();

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      setError('Product not found');
      setLoading(false);
      console.error('Error fetching product:', err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Quantity handlers
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, quantity);
      // Optional: Show success message or notification
      console.log(`Added to cart: ${product.name}, Size: ${selectedSize}, Quantity: ${quantity}`);
      alert(`${product.name} added to cart!`);
    }
  };

  // Buy now function
  const handleBuyNow = () => {
    if (product) {
      addToCart(product, selectedSize, quantity);
      // Navigate to cart page
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="w-full h-96 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="md:w-1/2 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{error || 'Product not found'}</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </>
    );
  }

  const isProductInCart = isInCart(product.id, selectedSize);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image - Left Side */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={`http://localhost:5173/${product.image}`} 
                alt={product.name}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found';
                }}
              />
            </div>
          </div>

          {/* Product Details - Right Side */}
          <div className="md:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-gray-900">{product.price}</p>
              {product.category && (
                <p className="text-gray-600 mt-1">{product.category}</p>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Size:</h3>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border-2 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-900 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Quantity:</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-medium hover:border-gray-400 transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-medium hover:border-gray-400 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-lg transition-colors shadow-md ${
                  isProductInCart 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'text-white'
                }`}
                style={!isProductInCart ? { 
                  backgroundColor: 'rgba(182, 152, 91, 0.85)',
                } : {}}
                onMouseEnter={(e) => {
                  if (!isProductInCart) {
                    e.target.style.backgroundColor = 'rgba(182, 152, 91, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProductInCart) {
                    e.target.style.backgroundColor = 'rgba(182, 152, 91, 0.85)';
                  }
                }}
              >
                {isProductInCart ? '✓ Added to Cart' : 'Add to cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors shadow-md"
              >
                Buy it now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailCard;