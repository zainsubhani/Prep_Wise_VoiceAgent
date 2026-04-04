// components/HeroSection.tsx
import ParticlesBackground from "../../ui/ParticlesBackground";
import { heroContent } from "@/constants/hero-content";
import Link from "next/link";


export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-[#0f0f1a] overflow-hidden">
      <ParticlesBackground />

      <div className="text-center px-4 sm:px-6 md:px-8 max-w-4xl">
        <span className="text-xs tracking-widest text-green-400 uppercase mb-4 inline-block">
          {heroContent.badge}
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          {heroContent.title.main}{" "}
          <span className="text-gray-800/40">{heroContent.title.sub}</span>
          <br />
          <span className="text-cyan-400">
            {heroContent.title.highlight}
          </span>
        </h1>

        <p className="mt-6 text-gray-300 text-lg md:text-xl">
          {heroContent.description}
        </p>


<div className="mt-10 flex justify-center gap-4 flex-wrap">
  <Link
    href="/sign-up"
    className="bg-cyan-400 text-black font-semibold px-6 py-3 rounded-md hover:bg-cyan-300 transition"
  >
    {heroContent.buttons.primary}
  </Link>

  <Link
    href="/sign-in"
    className="border border-gray-400 text-gray-400 font-semibold px-6 py-3 rounded-md hover:bg-gray-800 hover:text-white transition"
  >
    {heroContent.buttons.secondary}
  </Link>
</div>
      </div>
    </section>
  );
}