import CorePlatformSection from '@/components/sections/corePlatformSection'
import FinalCtaSection from '@/components/sections/FinalCtaSection'
import HeroSection from '@/components/sections/HeroSection'
import LiveSessionSection from '@/components/sections/liveSession'
import Navbar from '@/components/sections/NavBar'
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