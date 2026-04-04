import DashboardStats from "@/components/dashboard/DashboardStats";
import InterviewSection from "@/components/dashboard/InterviewSection";
import PerformanceOverview from "@/components/dashboard/PerformanceOverview";
import {
  availableInterviews,
  pastInterviews,
} from "@/constants/dashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#040816] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,224,0.07),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(0,119,255,0.05),transparent_20%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px] opacity-20" />

      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-400">
            Dashboard
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-white">
            Your Interview Command Center
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/55">
            Track completed interviews, review your performance, and start the
            next session with structured AI-driven feedback.
          </p>
        </header>

        <DashboardStats />
        <PerformanceOverview />

        <InterviewSection
          title="Pick Your Interview"
          interviews={availableInterviews}
        />

        <InterviewSection
          title="Your Past Interviews"
          interviews={pastInterviews}
        />
      </div>
    </main>
  );
}