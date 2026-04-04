import { liveSessionContent } from "@/constants/live-session";

export default function LiveSessionSection() {
  return (
    <section className="relative bg-[#050816] px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[80px_80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-white/10 rounded-xl overflow-hidden mb-16">
          {liveSessionContent.stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 text-center border-r border-b md:border-b-0 border-white/10 last:border-r-0"
            >
              <h3 className="text-3xl md:text-5xl font-bold text-cyan-400">
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

          <h2 className="text-4xl md:text-6xl font-extrabold text-white">
            {liveSessionContent.title}
          </h2>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-white/3 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur">

          {/* LEFT: TERMINAL UI */}
          <div className="bg-black rounded-xl p-6 font-mono text-sm text-green-400 shadow-inner">
            
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
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
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