import { recentActivity, skillProgress } from "@/constants/dashboard";

export default function PerformanceOverview() {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[28px] border border-white/10 bg-[#0a1022]/85 p-6 backdrop-blur-xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">
            Progress Overview
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">
            Skill Performance
          </h2>
        </div>

        <div className="space-y-6">
          {skillProgress.map((item) => (
            <div key={item.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-white/80">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-cyan-400">
                  {item.value}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#0a1022]/85 p-6 backdrop-blur-xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">
            Recent Activity
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">
            Latest Updates
          </h2>
        </div>

        <div className="space-y-4">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/8 bg-white/3 p-4"
            >
              <h3 className="text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-white/45">{item.time}</p>
              <p className="mt-3 text-sm font-medium text-cyan-400">
                {item.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}