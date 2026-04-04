import FeaturesHero from "@/components/sections/features/FeaturesHero";
import FeaturesGrid from "@/components/sections/features/FeaturesGrid";
import FeaturesSteps from "@/components/sections/features/FeaturesStep";
import FeaturesCta from "@/components/sections/features/FeaturesCta";

export default function FeaturesPage() {
  return (
    <main className="bg-[#040816] text-white">
      <FeaturesHero />
      <FeaturesGrid />
      <FeaturesSteps />
      <FeaturesCta />
    </main>
  );
}