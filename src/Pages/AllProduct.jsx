import React, { useState, useEffect } from 'react';
import { api } from '../Api/Axios';
import Navbar from '../Components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../Context/CartProvider';

function AllProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, isInCart } = useCart();

  const fetchProducts = async () => {
    const response = await api.get('/products');
    setProducts(response.data);
    setFilteredProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    if (searchQuery && products.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [location.search, products]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 rounded-xl">
        <h2 className="text-3xl font-bold mb-8">EXPLORE</h2>

        {location.search && (
          <div className="mb-4">
            <p className="text-gray-600">
              Showing results for: "{new URLSearchParams(location.search).get('search')}"
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