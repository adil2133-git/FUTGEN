// Categories.js - Fixed for your current db.json
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../Api/Axios';
import Navbar from '../Components/Navbar';
import { useCart } from '../Context/CartProvider';

function Categories() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryName || 'all');
  const { addToCart, isInCart } = useCart();

  // Category mapping for display names
  const categoryDisplayNames = {
    tshirts: 'T-SHIRTS',
    jackets: 'JACKETS',
    sweatshirts: 'SWEATSHIRTS',
    joggers: 'JOGGERS',
    all: 'BROWSE MORE COLLECTIONS'
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on selected category
  useEffect(() => {
    if (categoryName) {
      setSelectedCategory(categoryName);
    }
  }, [categoryName]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  // Only 4 categories as requested
  const categories = [
    { id: 'all', name: 'ALL COLLECTIONS' },
    { id: 'tshirts', name: 'T-SHIRTS' },
    { id: 'jackets', name: 'JACKETS' },
    { id: 'sweatshirts', name: 'SWEATSHIRTS' },
    { id: 'joggers', name: 'JOGGERS' }
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                    <div className="w-full h-64 bg-gray-300 rounded-t-xl mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {categoryDisplayNames[selectedCategory] || 'BROWSE MORE COLLECTIONS'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of football-inspired apparel
            </p>
          </div>

          {/* Categories Navigation - Centered with 4 categories */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    if (category.id === 'all') {
                      navigate('/categories');
                    } else {
                      navigate(`/category/${category.id}`);
                    }
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-black text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-12">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id || product.product_id}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group/card cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img 
                        src={`http://localhost:5173/${product.image}`} 
                        className="w-full h-80 object-cover rounded-t-xl transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                        }}
                      />
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`absolute bottom-4 right-4 px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ${
                          isInCart(product.id) 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {isInCart(product.id) ? '✓ In Cart' : '+ Quick add'}
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.name}</h3>
                      <p className="text-gray-600 font-medium mb-2">{product.price}</p>
                      {product.category && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {product.category.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  No products found in {categoryDisplayNames[selectedCategory]}
                </h3>
                <p className="text-gray-500 mb-8">
                  {selectedCategory === 'sweatshirts' || selectedCategory === 'joggers' 
                    ? "We're working on adding products to this category. Check back soon!"
                    : "We're constantly adding new products. Check back soon!"
                  }
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    navigate('/categories');
                  }}
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  View All Collections
                </button>
              </div>
            )}
          </div>

          {/* Category Description */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Premium Football Apparel
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Explore our exclusive collection of football-inspired clothing. 
              From vintage t-shirts to premium jackets, sweatshirts, and joggers - 
              each piece is designed for true football enthusiasts who want to showcase their passion for the beautiful game.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Categories;