// components/HeroSection.tsx
import ParticlesBackground from "../../ui/ParticlesBackground";
import { heroContent } from "@/constants/hero-content";
import Link from "next/link";


export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] w-full items-center justify-center overflow-hidden bg-[#0f0f1a] px-4 py-20 sm:min-h-[calc(100svh-6rem)] sm:px-6 lg:px-8">
      <ParticlesBackground />

      <div className="max-w-4xl text-center">
        <span className="text-xs tracking-widest text-green-400 uppercase mb-4 inline-block">
          {heroContent.badge}
        </span>

        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-7xl">
          {heroContent.title.main}{" "}
          <span className="text-gray-800/40">{heroContent.title.sub}</span>
          <br />
          <span className="text-cyan-400">
            {heroContent.title.highlight}
          </span>
        </h1>

        <p className="mt-6 text-base leading-7 text-gray-300 sm:text-lg md:text-xl">
          {heroContent.description}
        </p>


<div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
  <Link
    href="/sign-up"
    className="rounded-md bg-cyan-400 px-6 py-3 text-center font-semibold text-black transition hover:bg-cyan-300"
  >
    {heroContent.buttons.primary}
  </Link>

  <Link
    href="/sign-in"
    className="rounded-md border border-gray-400 px-6 py-3 text-center font-semibold text-gray-400 transition hover:bg-gray-800 hover:text-white"
  >
    {heroContent.buttons.secondary}
  </Link>
</div>
      </div>
    </section>
  );
}
