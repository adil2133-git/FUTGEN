import React from 'react'
import banner from '../assets/banner.webp'

function MainBanner() {
  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden">
  <img 
    src={banner}
    alt='FUTGEN Football Fashion'
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/40 flex items-center">
    <div className="max-w-7xl mx-auto px-6 text-white">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
        FOOTBALL <span className="text-red-500">MEETS</span> FASHION
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl">
        Premium streetwear for the modern football enthusiast
      </p>
      <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105">
        SHOP NOW
      </button>
    </div>
  </div>
</div>
  )
}

export default MainBanner