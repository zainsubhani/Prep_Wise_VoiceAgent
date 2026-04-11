export default function FeaturesHero() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,224,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-400">
          Features
        </p>

        <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
          Everything You Need to{" "}
          <span className="text-cyan-400">Crack Interviews</span>
        </h1>

        <p className="mt-6 text-base leading-7 text-white/60 sm:text-lg">
          Practice real interview scenarios, get AI-powered feedback, and track
          your progress — all in one platform.
        </p>
      </div>
    </section>
  );
}
