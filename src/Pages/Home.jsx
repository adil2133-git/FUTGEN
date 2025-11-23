import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Card from '../Components/Card'
import MainBanner from '../Components/MainBanner'
import AlternateBanner from '../Components/AlternateBanner'
import NewsLetter from '../Components/NewsLetter'

function Home() {
  return (
    <div>
        <Navbar />
        <MainBanner />
        <Card />
        <AlternateBanner />
        <NewsLetter />
        <Footer />
    </div>
  )
}

export default Home