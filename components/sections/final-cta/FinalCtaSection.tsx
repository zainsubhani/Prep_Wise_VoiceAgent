"use client";

import { finalCtaContent } from "@/constants/final-cta";

export default function FinalCtaSection() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/4 px-6 py-12 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md sm:px-10 sm:py-16 lg:px-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
          {finalCtaContent.title}
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/45 sm:text-lg">
          {finalCtaContent.description}
        </p>

        <form className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-4 sm:flex-row">
          <input
            type="email"
            placeholder={finalCtaContent.placeholder}
            className="h-14 flex-1 border border-white/10 bg-white/4 px-5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan-400/60 focus:bg-white/6"
          />

          <button
            type="submit"
            className="h-14 min-w-45 border border-cyan-300/60 bg-cyan-400 px-6 text-sm font-bold tracking-[0.25em] text-black transition hover:bg-cyan-300"
          >
            {finalCtaContent.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}