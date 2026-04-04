import CorePlatformSection from "@/components/sections/core-platform/CorePlatformSection";
import FinalCtaSection from "@/components/sections/final-cta/FinalCtaSection";
import Footer from "@/components/sections/footer/Footer";
import HeroSection from "@/components/sections/hero-section/HeroSection";
import LiveSessionSection from "@/components/sections/live-session/LiveSessionSection";
import Navbar from "@/components/sections/nav-bar/NavBar";

export default function Page() {
  return (
    <main className="flex-1 flex flex-col bg-[#050816] text-white">
      <HeroSection />
      <CorePlatformSection />
      <LiveSessionSection />
      <FinalCtaSection />
    </main>
  );
}