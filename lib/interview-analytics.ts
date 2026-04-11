import { InterviewRecord } from "@/types/interview-history";

type SkillKey =
  | "communication"
  | "technicalDepth"
  | "confidence"
  | "problemSolving"
  | "clarity";

const skillLabels: Record<SkillKey, string> = {
  communication: "Communication",
  technicalDepth: "Technical Depth",
  confidence: "Confidence",
  problemSolving: "Problem Solving",
  clarity: "Clarity",
};

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length
  );
}

function formatInterviewLabel(index: number) {
  return `Interview ${index + 1}`;
}

export function formatInterviewDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeInterviewDate(date: string) {
  const target = new Date(date).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) < 1) {
    return "Today";
  }

  if (Math.abs(diffDays) === 1) {
    return diffDays > 0 ? "Tomorrow" : "Yesterday";
  }

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    diffDays,
    "day"
  );
}

export function buildInterviewAnalytics(interviews: InterviewRecord[]) {
  const chronological = [...interviews].reverse();
  const totalInterviews = interviews.length;
  const averageScore = average(interviews.map((item) => item.overallScore));
  const firstScore = chronological[0]?.overallScore ?? 0;
  const latestInterview = interviews[0];
  const latestScore = latestInterview?.overallScore ?? 0;
  const scoreChange = latestScore - firstScore;

  const skillAverages = (Object.keys(skillLabels) as SkillKey[]).map((key) => ({
    key,
    label: skillLabels[key],
    value: average(interviews.map((item) => item[key])),
  }));

  const strongestSkill = [...skillAverages].sort((a, b) => b.value - a.value)[0];
  const weakestSkill = [...skillAverages].sort((a, b) => a.value - b.value)[0];

  const progressData = chronological.map((item, index) => ({
    interview: formatInterviewLabel(index),
    name: formatInterviewLabel(index),
    score: item.overallScore,
    date: formatInterviewDate(item.createdAt),
  }));

  const categoryMap = new Map<string, number[]>();

  for (const interview of interviews) {
    const scores = categoryMap.get(interview.interviewType) ?? [];
    scores.push(interview.overallScore);
    categoryMap.set(interview.interviewType, scores);
  }

  const categoryData = Array.from(categoryMap.entries()).map(
    ([name, scores]) => ({
      name,
      score: average(scores),
    })
  );

  const focusAreas = skillAverages
    .slice()
    .sort((a, b) => a.value - b.value)
    .slice(0, 3)
    .map((item) => item.label);

  const recommendedActions = [
    latestInterview?.nextSteps?.[0],
    latestInterview?.nextSteps?.[1],
    ...interviews.flatMap((item) => item.improvements).slice(0, 2),
  ].filter((item, index, array): item is string => Boolean(item) && array.indexOf(item) === index);

  const recentFeedback = interviews.slice(0, 3).map((item) => ({
    id: item.id,
    role: item.role,
    company: item.company || "General",
    date: formatInterviewDate(item.createdAt),
    relativeDate: formatRelativeInterviewDate(item.createdAt),
    score: item.overallScore,
    strengths: item.strengths,
    improvements: item.improvements,
    summary: item.summary,
    interviewType: item.interviewType,
  }));

  const recentActivity = interviews.slice(0, 3).map((item) => ({
    id: item.id,
    title: `${item.role} interview completed`,
    time: formatRelativeInterviewDate(item.createdAt),
    status: `Score: ${item.overallScore}/100`,
  }));

  const latestSummary = latestInterview?.summary ?? "";

  return {
    totalInterviews,
    averageScore,
    latestScore,
    scoreChange,
    strongestSkill,
    weakestSkill,
    latestSummary,
    progressData,
    skillData: skillAverages.map((item) => ({
      skill: item.label,
      value: item.value,
    })),
    categoryData,
    recentFeedback,
    recentActivity,
    focusAreas,
    recommendedActions,
  };
}
