type InterviewCardProps = {
  title: string;
  category: string;
  description: string;
  icon: string;
  accent: string;
  actionLabel: string;
  date?: string;
  score?: string;
};

export default function InterviewCard({
  title,
  category,
  description,
  icon,
  accent,
  actionLabel,
  date,
  score,
}: InterviewCardProps) {
  const isTechnical = category === "Technical";

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a1022]/85 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,224,0.05),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,119,255,0.05),transparent_28%)]" />

      <div className="relative">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br ${accent} text-4xl font-black text-white shadow-lg`}
          >
            {icon}
          </div>

          <span className="rounded-bl-2xl rounded-tr-2xl bg-[#7d82bd]/70 px-4 py-2 text-sm font-medium text-white">
            {category}
          </span>
        </div>

        <h3 className="text-2xl font-semibold leading-tight text-white">
          {title}
        </h3>

        {(date || score) && (
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
            {date && <span>{date}</span>}
            {score && <span>{score}</span>}
          </div>
        )}

        <p className="mt-5 min-h-24 text-base leading-8 text-white/55">
          {description}
        </p>

        <div className="mt-6 h-px bg-white/10" />

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#141a33] text-cyan-400">
              ⚛
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#141a33] text-cyan-400">
              ≋
            </span>
          </div>

          <button
            className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
              isTechnical
                ? "bg-[#c9c1ff] text-black hover:bg-[#b8adff]"
                : "bg-[#c9c1ff] text-black hover:bg-[#b8adff]"
            }`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
}