import InterviewCard from "./InterviewCard";
import {InterviewSectionProps } from "../../types/dashboard.types"


export default function InterviewSection({
  title,
  interviews,
}: InterviewSectionProps) {
  return (
    <section>
      <h2 className="mb-8 text-4xl font-black tracking-tight text-white">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} {...interview} />
        ))}
      </div>
    </section>
  );
}