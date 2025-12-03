import React, { useState, useEffect } from 'react';
import { api } from '../../Api/Axios';
import Dashboard from '../Component/Dashboard';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'tshirts', image: ''
  });

  const categories = [
    { value: 'tshirts', label: 'T-Shirts' },
    { value: 'jackets', label: 'Jackets' },
    { value: 'sweatshirts', label: 'Sweatshirts' },
    { value: 'joggers', label: 'Joggers' }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      alert('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
      let filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'all' || product.category === selectedCategory)
      );

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const parsePrice = (priceString) => {
    const price = priceString?.replace(/Rs\.|₹|,/g, '')?.replace(/\s+/g, '')?.trim();
    return parseFloat(price) || 0;
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: 'tshirts', image: '' });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price, category: product.category, image: product.image || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        const productData = { ...formData, id: Date.now().toString() };
        await api.post('/products', productData);
      }
      
      await fetchProducts();
      resetForm();
      alert(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      alert(`Error ${editingProduct ? 'updating' : 'adding'} product`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      await fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <Dashboard>
      <div className="p-4 sm:p-6">
        {/* Header with Add New Product Button - Made responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Product Management</h1>
          <button 
            onClick={() => { resetForm(); setShowAddForm(true); }} 
            className="w-full sm:w-auto bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800">Total Products</h3>
            <p className="text-xl sm:text-2xl font-bold text-red-600">{products.length}</p>
          </div>
          {categories.map(cat => (
            <div key={cat.value} className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800">{cat.label}</h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-600">{categoryCounts[cat.value] || 0}</p>
            </div>
          ))}
        </div>

        {/* Add New Product Form */}
        {showAddForm && !editingProduct && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Add New Product</h2>
              <button 
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 text-sm sm:text-base"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                    placeholder="Product Name" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base" 
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    value={formData.price} 
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} 
                    placeholder="Rs. 1,999.00" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base" 
                  />
                </div>
                
                <div>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} 
                    placeholder="Image URL" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base" 
                  />
                </div>
              </div>

              {formData.image && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 border rounded-lg overflow-hidden">
                    <img 
                      src={`http://localhost:5173/${formData.image}`} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=Image+Error'; }} 
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-red-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  {loading ? 'Saving...' : 'Add Product'}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="flex-1 bg-gray-500 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search products..." 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base" 
            />
            
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>

            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSortBy('name'); }} 
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Display */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No products found</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <React.Fragment key={product.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                src={`http://localhost:5173/${product.image}`} 
                                alt={product.name} 
                                className="h-10 w-10 rounded-lg object-cover" 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'; }} 
                              />
                              <div className="ml-4 text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleEditProduct(product)} 
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)} 
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                        
                        {editingProduct?.id === product.id && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 bg-gray-50">
                              <div className="bg-white p-4 rounded-lg border">
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="text-lg font-semibold">Edit Product</h3>
                                  <button 
                                    onClick={resetForm}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                                    <input 
                                      type="text" 
                                      value={formData.name} 
                                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                                      placeholder="Product Name" 
                                      required 
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base" 
                                    />
                                    <input 
                                      type="text" 
                                      value={formData.price} 
                                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} 
                                      placeholder="Rs. 1,999.00" 
                                      required 
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base" 
                                    />
                                    
                                    <select 
                                      value={formData.category} 
                                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} 
                                      required 
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                                    >
                                      {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                    </select>
                                    
                                    <input 
                                      type="text" 
                                      value={formData.image} 
                                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} 
                                      placeholder="Image URL" 
                                      required 
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base" 
                                    />
                                  </div>

                                  {formData.image && (
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                                      <div className="w-24 h-24 sm:w-32 sm:h-32 border rounded-lg overflow-hidden">
                                        <img 
                                          src={`http://localhost:5173/${formData.image}`} 
                                          alt="Preview" 
                                          className="w-full h-full object-cover" 
                                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=Image+Error'; }} 
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex gap-3">
                                    <button 
                                      type="submit" 
                                      disabled={loading} 
                                      className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                                    >
                                      {loading ? 'Saving...' : 'Update Product'}
                                    </button>
                                    <button 
                                      type="button" 
                                      onClick={resetForm} 
                                      className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile & Tablet Card View */}
              <div className="lg:hidden">
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row gap-3">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img 
                                src={`http://localhost:5173/${product.image}`} 
                                alt={product.name} 
                                className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover border" 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }} 
                              />
                            </div>
                            
                            {/* Product Details and Actions */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col h-full">
                                <div className="flex-1">
                                  <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{product.name}</h3>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{product.price}</p>
                                  
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                      {product.category}
                                    </span>
                                    <div className="text-xs text-gray-500 truncate">
                                      ID: {product.id}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Actions Buttons - Always visible */}
                                <div className="mt-3 flex gap-2">
                                  <button 
                                    onClick={() => handleEditProduct(product)} 
                                    className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(product.id)} 
                                    className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Edit Form in Card View - Only shown when editing */}
                        {editingProduct?.id === product.id && (
                          <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-semibold text-gray-800">Edit Product</h4>
                              <button 
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                ✕
                              </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                              <div className="space-y-3">
                                <input 
                                  type="text" 
                                  value={formData.name} 
                                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                                  placeholder="Product Name" 
                                  required 
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" 
                                />
                                <input 
                                  type="text" 
                                  value={formData.price} 
                                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} 
                                  placeholder="Rs. 1,999.00" 
                                  required 
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" 
                                />
                                
                                <select 
                                  value={formData.category} 
                                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} 
                                  required 
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                >
                                  {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                </select>
                                
                                <input 
                                  type="text" 
                                  value={formData.image} 
                                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} 
                                  placeholder="Image URL" 
                                  required 
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" 
                                />
                              </div>

                              {formData.image && (
                                <div className="mt-3 flex flex-col items-center">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Image Preview</label>
                                  <div className="w-20 h-20 sm:w-24 sm:h-24 border rounded-lg overflow-hidden">
                                    <img 
                                      src={`http://localhost:5173/${formData.image}`} 
                                      alt="Preview" 
                                      className="w-full h-full object-cover" 
                                      onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=Image+Error'; }} 
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="flex gap-2 mt-4">
                                <button 
                                  type="submit" 
                                  disabled={loading} 
                                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm"
                                >
                                  {loading ? 'Saving...' : 'Update'}
                                </button>
                                <button 
                                  type="button" 
                                  onClick={resetForm} 
                                  className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Dashboard>
  );
}

export default ProductManagement;