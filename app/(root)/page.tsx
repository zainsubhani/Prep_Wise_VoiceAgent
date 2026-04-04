import CorePlatformSection from '@/components/corePlatformSection'
import FinalCtaSection from '@/components/FinalCtaSection'
import HeroSection from '@/components/HeroSection'
import LiveSessionSection from '@/components/liveSession'
import Navbar from '@/components/NavBar'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
         <HeroSection />
      <CorePlatformSection />
      <LiveSessionSection/>
      <FinalCtaSection />
    </div>
  )
}

export default page