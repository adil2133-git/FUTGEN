// AboutUs.js
import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import FUTGEN from '../assets/FUTGEN.png';

function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <img 
              src={FUTGEN} 
              alt="FUTGEN" 
              className="h-24 mx-auto mb-8"
            />
            <h1 className="text-5xl font-bold mb-6">About FUTGEN</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Where Football Passion Meets Premium Fashion
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                FUTGEN was born from a simple yet powerful idea: football is more than just a game - 
                it's a culture, a passion, and a way of life. Founded by a team of dedicated football 
                enthusiasts and fashion designers, we set out to create apparel that truly represents 
                the spirit of the beautiful game.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that every football fan deserves to wear premium quality merchandise that 
                not only shows their allegiance but also reflects their personal style. From the 
                streets to the stadiums, FUTGEN is here to elevate your football fashion game.
              </p>
              <div className="bg-red-600 text-white p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-lg">
                  To create premium football-inspired apparel that connects fans worldwide through 
                  quality, style, and shared passion for the beautiful game.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">2023</div>
                  <div className="text-gray-700">Founded</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">1000+</div>
                  <div className="text-gray-700">Happy Customers</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">4</div>
                  <div className="text-gray-700">Categories</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
                  <div className="text-gray-700">Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose FUTGEN</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
                <p className="text-gray-600">
                  We use only the finest materials and craftsmanship to ensure our products 
                  stand the test of time, just like your favorite football legacy.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Unique Designs</h3>
                <p className="text-gray-600">
                  Our designs are inspired by football culture, blending vintage aesthetics 
                  with modern streetwear for a truly unique look.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fan First</h3>
                <p className="text-gray-600">
                  Created by fans, for fans. Every design is made with the true football 
                  enthusiast in mind, celebrating the sport we all love.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-3">Passion</h3>
                <p className="text-gray-300">
                  Football runs through our veins. It's not just a business, it's our passion.
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-3">Quality</h3>
                <p className="text-gray-300">
                  We never compromise on quality. Every stitch tells a story of excellence.
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-gray-300">
                  Building a global community of football lovers, one design at a time.
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-gray-300">
                  Constantly pushing boundaries in football fashion and design.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Join the FUTGEN Family</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Ready to showcase your football passion with premium apparel? 
              Explore our collections and become part of our growing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/product'}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </button>
              <button 
                onClick={() => window.location.href = '/categories'}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-red-600 transition-colors"
              >
                View Collections
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;