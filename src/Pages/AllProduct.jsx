import React, { useState, useEffect } from 'react';
import { api } from '../Api/Axios';
import Navbar from '../Components/Navbar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../Context/CartProvider';
import { useWishlist } from '../Context/WishlistProvider';

function AllProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const fetchProducts = async () => {
    const response = await api.get('/products');
    setProducts(response.data);
    setFilteredProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get('search');

    if (searchQuery && products.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchParams, products]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 rounded-xl">
        <h2 className="text-3xl font-bold mb-8">EXPLORE</h2>

        {searchParams.get('search') && (
          <div className="mb-4">
            <p className="text-gray-600">
              Showing results for: "{searchParams.get('search')}"
              {filteredProducts.length === 0 && ' - No products found'}
            </p>
          </div>
        )}

        <div className="mb-8 last:mb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id || product.product_id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group/card cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative overflow-hidden rounded-t-xl">
                  <img 
                    src={product.image} 
                    className="w-full h-64 object-cover rounded-t-xl transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                    }}
                  />
                  
                  {/* Wishlist Button */}
                  <button 
                    onClick={(e) => handleWishlistClick(e, product)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors opacity-0 group-hover/card:opacity-100"
                  >
                    <svg 
                      className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                      viewBox="0 0 20 20"
                      fill={isInWishlist(product.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Quick Add Button */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ${
                      isInCart(product.id) 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isInCart(product.id) ? '✓ In Cart' : '+ Quick add'}
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-lg mb-2">{product.name}</p>
                  <p className="text-gray-600 font-medium">{product.price}</p>
                  {product.category && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-2">
                      {product.category.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </>
  );
}

export default AllProduct;