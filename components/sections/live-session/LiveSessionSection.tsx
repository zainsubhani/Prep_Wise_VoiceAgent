import { liveSessionContent } from "@/constants/live-session";

export default function LiveSessionSection() {
  return (
    <section className="relative overflow-hidden bg-[#050816] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[80px_80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* ===== STATS ===== */}
        <div className="mb-12 grid grid-cols-1 overflow-hidden rounded-xl border border-white/10 sm:grid-cols-2 md:mb-16 md:grid-cols-4">
          {liveSessionContent.stats.map((stat, i) => (
            <div
              key={i}
              className="border-b border-white/10 p-5 text-center sm:border-r sm:p-6 md:border-b-0 last:border-b-0 sm:even:border-r-0 md:even:border-r md:last:border-r-0"
            >
              <h3 className="text-3xl font-bold text-cyan-400 md:text-5xl">
                {stat.value}
              </h3>
              <p className="mt-2 text-xs tracking-widest uppercase text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ===== HEADER ===== */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-cyan-400 uppercase mb-3">
            {liveSessionContent.badge}
          </p>

          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-6xl">
            {liveSessionContent.title}
          </h2>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="grid items-center gap-8 rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur sm:p-6 md:p-10 lg:grid-cols-2 lg:gap-10">

          {/* LEFT: TERMINAL UI */}
          <div className="overflow-x-auto rounded-xl bg-black p-4 font-mono text-xs text-green-400 shadow-inner sm:p-6 sm:text-sm">
            
            <div className="flex gap-2 mb-4">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            <p className="text-cyan-400">axis:// session init L5-backend</p>
            <p className="text-white/50 mb-4">— Connecting to runtime —</p>

            <p className="text-white mb-2">
              Q: Design a rate limiter that handles
            </p>
            <p className="text-white mb-4">
              10M req/s with P99 &lt; 2ms.
            </p>

           <p className="text-green-400 mb-2">
  &gt; Candidate typing...
  <span className="ml-1 inline-block w-2 h-5 bg-cyan-400 animate-pulse"></span>
</p>

            <p className="text-green-400">✔ Signal: Token bucket detected</p>
            <p className="text-green-400">✔ Edge cases: 3/5 covered</p>
            <p className="text-yellow-400">
              ⚠ Distributed sync: pending
            </p>
          </div>

          {/* RIGHT: TEXT */}
          <div>
            <h3 className="mb-6 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
              {liveSessionContent.rightSection.title}
            </h3>

            <p className="text-white/60 mb-6 leading-relaxed">
              {liveSessionContent.rightSection.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {liveSessionContent.rightSection.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 text-sm border rounded-md ${
                    tag === "Live Feedback"
                      ? "border-cyan-400 text-cyan-400"
                      : "border-white/20 text-white/50"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
