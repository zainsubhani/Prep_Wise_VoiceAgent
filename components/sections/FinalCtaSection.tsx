"use client";

import { finalCtaContent } from "@/constants/final-cta";

export default function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#050816] px-4 py-24 sm:px-6 lg:px-8">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,224,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(0,255,224,0.06),transparent_20%),radial-gradient(circle_at_top_right,rgba(0,119,255,0.06),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] opacity-25" />
      </div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center">
        {/* center card */}
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md sm:px-10 sm:py-16 lg:px-16">
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
                className="h-14 flex-1 rounded-none border border-white/10 bg-white/[0.04] px-5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan-400/60 focus:bg-white/[0.06]"
              />

              <button
                type="submit"
                className="h-14 min-w-[180px] border border-cyan-300/60 bg-cyan-400 px-6 text-sm font-bold tracking-[0.25em] text-black transition hover:bg-cyan-300"
              >
                {finalCtaContent.buttonText}
              </button>
            </form>
          </div>
        </div>

        {/* footer */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 text-sm text-white/30 sm:flex-row">
          <p>{finalCtaContent.footer.copyright}</p>

          <div className="flex items-center gap-4">
            {finalCtaContent.footer.links.map((link) => (
              <button
                key={link}
                className="transition hover:text-white/60"
                type="button"
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>{finalCtaContent.footer.status}</span>
          </div>
        </div>
      </div>
    </section>
  );
}