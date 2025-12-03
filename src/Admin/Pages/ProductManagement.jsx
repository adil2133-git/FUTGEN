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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
          <button onClick={() => { resetForm(); setShowAddForm(true); }} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
            <p className="text-2xl font-bold text-red-600">{products.length}</p>
          </div>
          {categories.map(cat => (
            <div key={cat.value} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">{cat.label}</h3>
              <p className="text-2xl font-bold text-gray-600">{categoryCounts[cat.value] || 0}</p>
            </div>
          ))}
        </div>

        {showAddForm && !editingProduct && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Product Name" required className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                <input type="text" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} placeholder="Rs. 1,999.00" required className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                
                <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} required className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
                
                <input type="text" value={formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} placeholder="Image URL" required className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>

              {formData.image && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                    <img src={`http://localhost:5173/${formData.image}`} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=Image+Error'; }} />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400">
                  {loading ? 'Saving...' : 'Add Product'}
                </button>
                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
            </select>

            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSortBy('name'); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? <div className="p-8 text-center">Loading products...</div> : 
           filteredProducts.length === 0 ? <div className="p-8 text-center text-gray-500">No products found</div> : 
           <div className="overflow-x-auto">
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
                          <img src={`http://localhost:5173/${product.image}`} alt={product.name} className="h-10 w-10 rounded-lg object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'; }} />
                          <div className="ml-4 text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEditProduct(product)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                    
                    {editingProduct?.id === product.id && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="bg-white p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold mb-3">Edit Product</h3>
                            <form onSubmit={handleSubmit}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Product Name" required className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                                <input type="text" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} placeholder="Rs. 1,999.00" required className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                                
                                <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} required className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                                  {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                </select>
                                
                                <input type="text" value={formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} placeholder="Image URL" required className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                              </div>

                              {formData.image && (
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                                    <img src={`http://localhost:5173/${formData.image}`} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=Image+Error'; }} />
                                  </div>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <button type="submit" disabled={loading} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400">
                                  {loading ? 'Saving...' : 'Update Product'}
                                </button>
                                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
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
          </div>}
        </div>
      </div>
    </Dashboard>
  );
}

export default ProductManagement;