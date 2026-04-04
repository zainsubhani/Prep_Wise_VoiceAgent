import { dashboardStats } from "@/constants/dashboard";

export default function DashboardStats() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-sm"
        >
          <p className="text-sm uppercase tracking-[0.22em] text-white/40">
            {stat.label}
          </p>

          <h2 className="mt-4 text-4xl font-black text-cyan-400">
            {stat.value}
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/50">
            {stat.subtext}
          </p>
        </div>
      ))}
    </section>
  );
}