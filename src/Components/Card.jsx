import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { api } from '../Api/Axios'
import { useNavigate } from 'react-router-dom'

function Card() {
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  // Fetch products from db.json using Axios
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products')
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const checkScrollPosition = () => {
    const container = containerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      
      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollRight = () => {
    const container = containerRef.current
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  const scrollLeft = () => {
    const container = containerRef.current
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const addToCart = (productName) => {
    console.log(`Added ${productName} to cart`)
    // Add your cart logic here
  }

  useEffect(() => {
    checkScrollPosition()
    window.addEventListener('resize', checkScrollPosition)
    
    return () => {
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [])

  // Update scroll buttons when products load
  useEffect(() => {
    if (products.length > 0) {
      setTimeout(checkScrollPosition, 100)
    }
  }, [products])

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 rounded-xl">
        <h2 className="text-3xl font-bold mb-8">EXPLORE</h2>
        <div className="flex justify-center items-center h-40">
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 rounded-xl">
      <h2 className="text-3xl font-bold mb-8">EXPLORE</h2>
      
      <div className="relative group">
        <div 
          ref={containerRef}
          className="flex overflow-x-auto gap-8 scroll-smooth"
          onScroll={checkScrollPosition}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          {products.slice(0,6).map((product) => (
            <div 
              key={product.product_id}
              className="flex-shrink-0 w-64 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group/card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img 
                  src={product.image} 
                  className="w-full h-64 object-cover rounded-t-xl transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                  alt={product.name}
                />
                <button 
                  onClick={() => addToCart(product.name)}
                  className="absolute bottom-2 right-2 bg-black text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 hover:bg-gray-800"
                >
                  + Quick add
                </button>
              </div>
              <div className="p-4">
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-gray-600 font-medium">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Left Navigation Button */}
        {showLeftButton && (
          <button 
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-xl hover:bg-gray-100 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Navigation Button */}
        {showRightButton && (
          <button 
            onClick={scrollRight}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-xl hover:bg-gray-100 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Card