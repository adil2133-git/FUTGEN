import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import { useCart } from '../Context/CartProvider';
import { useNavigate } from 'react-router-dom';
import GPAY from '../assets/gpay.png'
import PHONEPE from '../assets/phonepe.png'
import PAYTM from '../assets/paytm.png'
import BHIM from '../assets/bhim.png'

function Checkout() {
  const { cart, getCartTotal, clearCart, getItemTotal } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    upiId: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      alert('Payment Successful! Your order has been placed.');
      clearCart();
      setLoading(false);
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Items to Checkout</h2>
            <p className="text-gray-600 mb-8">Your cart is empty. Add some products to proceed.</p>
            <button
              onClick={() => navigate('/product')}
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  const total = getCartTotal();

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">UPI Payment</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="yourname@upi"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter your UPI ID (e.g., name@paytm, name@ybl, name@okicici)</p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">How to Pay with UPI</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Enter your UPI ID above</li>
                      <li>• Click "Pay Now" to proceed</li>
                      <li>• You will be redirected to your UPI app</li>
                      <li>• Complete the payment in your UPI app</li>
                    </ul>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex space-x-2">
                      <img src={GPAY} alt="Google Pay" className="h-8 w-auto" />
                      <img src={PHONEPE} alt="PhonePe" className="h-8 w-auto" />
                      <img src={PAYTM} alt="Paytm" className="h-8 w-auto" />
                      <img src={BHIM} alt="BHIM" className="h-8 w-auto" />
                    </div>
                    <span className="text-sm text-gray-600">All UPI apps supported</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing Payment...' : `Pay ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
              </button>
            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map((item) => {
                  const itemTotal = getItemTotal(item);
                  
                  return (
                    <div key={item.cartId} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Size: {item.size} × {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{itemTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    </div>
                  );
                })}
                
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
