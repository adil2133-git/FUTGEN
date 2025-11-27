import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../Api/Axios';
import Navbar from '../Components/Navbar';
import { useCart } from '../Context/CartProvider';
import { useWishlist } from '../Context/WishlistProvider';

function DetailCard() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const fetchProduct = async () => {
    const response = await api.get(`/products/${productId}`);
    setProduct(response.data);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, quantity);
      console.log(`Added to cart: ${product.name}, Size: ${selectedSize}, Quantity: ${quantity}`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, selectedSize, quantity);
      navigate('/cart');
    }
  };

  const handleWishlistClick = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const isProductInCart = isInCart(product?.id, selectedSize);
  const isProductInWishlist = isInWishlist(product?.id);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={`http://localhost:5173/${product?.image}`} 
                alt={product?.name}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found';
                }}
              />
            </div>
          </div>

          <div className="md:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
              <p className="text-2xl font-semibold text-gray-900">{product?.price}</p>
              {product?.category && (
                <p className="text-gray-600 mt-1">{product.category}</p>
              )}
            </div>

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

            {/* Wishlist Button */}
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={handleWishlistClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isProductInWishlist
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg 
                  className={`w-5 h-5 ${isProductInWishlist ? 'fill-current' : ''}`} 
                  viewBox="0 0 20 20"
                  fill={isProductInWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

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