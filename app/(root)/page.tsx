import CorePlatformSection from "@/components/sections/core-platform/CorePlatformSection";
import FinalCtaSection from "@/components/sections/final-cta/FinalCtaSection";
import HeroSection from "@/components/sections/hero-section/HeroSection";
import LiveSessionSection from "@/components/sections/live-session/LiveSessionSection";

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