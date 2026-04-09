"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";

import {stats, progressData, skillData, categoryData , recentFeedback} from '../../constants/Feedback.data';

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-[#030711] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Performance Insights
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Feedback Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60 md:text-base">
            Track your interview performance, review strengths, and monitor your growth over time.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <p className="text-sm text-white/60">{item.title}</p>
              <h2 className="mt-3 text-3xl font-semibold text-cyan-400">{item.value}</h2>
              <p className="mt-2 text-sm text-white/50">{item.subtext}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 xl:col-span-2">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Score Progress</h2>
              <p className="text-sm text-white/50">
                Your interview scores across recent sessions
              </p>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="interview" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#081120",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#22d3ee" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Skill Breakdown</h2>
              <p className="text-sm text-white/50">
                Performance across core interview skills
              </p>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="skill" stroke="rgba(255,255,255,0.6)" />
                  <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 xl:col-span-1">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Category Scores</h2>
              <p className="text-sm text-white/50">
                Compare performance by interview type
              </p>
            </div>

            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#081120",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="score" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 xl:col-span-2">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Recent Feedback</h2>
              <p className="text-sm text-white/50">
                Review the latest interview insights and action points
              </p>
            </div>

            <div className="space-y-4">
              {recentFeedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#081120] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.role} · {item.company}
                      </h3>
                      <p className="mt-1 text-sm text-white/50">{item.date}</p>
                    </div>

                    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-300">
                      Score: <span className="font-semibold">{item.score}%</span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                      <p className="mb-3 text-sm font-medium text-emerald-300">
                        Strengths
                      </p>
                      <div className="space-y-2">
                        {item.strengths.map((point) => (
                          <p key={point} className="text-sm text-white/80">
                            • {point}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-4">
                      <p className="mb-3 text-sm font-medium text-amber-300">
                        Improvement Areas
                      </p>
                      <div className="space-y-2">
                        {item.improvements.map((point) => (
                          <p key={point} className="text-sm text-white/80">
                            • {point}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}