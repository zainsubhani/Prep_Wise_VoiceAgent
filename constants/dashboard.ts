import type {
  DashboardStat,
  InterviewCardItem,
  RecentActivityItem,
  SkillProgressItem,
} from "@/types/dashboard.types";

export const dashboardStats: DashboardStat[] = [
  {
    label: "Interviews Completed",
    value: "12",
    subtext: "+3 this week",
  },
  {
    label: "Average Review Score",
    value: "87%",
    subtext: "+5% from last month",
  },
  {
    label: "Technical Interviews",
    value: "8",
    subtext: "Frontend, Backend, System Design",
  },
  {
    label: "Behavioral Interviews",
    value: "4",
    subtext: "Communication and HR screening",
  },
];

export const availableInterviews: InterviewCardItem[] = [
  {
    id: 1,
    title: "Full-Stack Dev Interview",
    category: "Technical",
    description:
      "Practice frontend, backend, architecture, and real-world engineering tradeoffs.",
    icon: "Y!",
    accent: "from-violet-500 to-fuchsia-500",
    actionLabel: "Take interview",
  },
  {
    id: 2,
    title: "DevOps & Cloud Interview",
    category: "Technical",
    description:
      "Test infrastructure thinking, deployment pipelines, observability, and cloud design.",
    icon: "R",
    accent: "from-orange-500 to-red-500",
    actionLabel: "Take interview",
  },
  {
    id: 3,
    title: "HR Screening Interview",
    category: "Non-Technical",
    description:
      "Prepare for recruiter screens, motivation questions, and communication assessment.",
    icon: "✈",
    accent: "from-sky-400 to-cyan-500",
    actionLabel: "Take interview",
  },
];

export const pastInterviews: InterviewCardItem[] = [
  {
    id: 101,
    title: "Frontend Dev Interview",
    category: "Technical",
    description:
      "Strong UI thinking and React fundamentals. Improve accessibility depth and testing structure.",
    icon: "H",
    accent: "from-violet-500 to-indigo-500",
    actionLabel: "View interview",
    date: "Feb 28, 2025",
    score: "72/100",
  },
  {
    id: 102,
    title: "Behavioral Interview",
    category: "Non-Technical",
    description:
      "Clear communication and confidence. Improve story structure and ownership examples.",
    icon: "f",
    accent: "from-blue-500 to-sky-400",
    actionLabel: "View interview",
    date: "Feb 23, 2025",
    score: "54/100",
  },
];

export const skillProgress: SkillProgressItem[] = [
  {
    id: 1,
    label: "DSA",
    value: 78,
  },
  {
    id: 2,
    label: "System Design",
    value: 64,
  },
  {
    id: 3,
    label: "Behavioral",
    value: 82,
  },
  {
    id: 4,
    label: "Communication",
    value: 71,
  },
];

export const recentActivity: RecentActivityItem[] = [
  {
    id: 1,
    title: "Completed Backend Dev Interview",
    time: "2 hours ago",
    status: "Score: 94/100",
  },
  {
    id: 2,
    title: "Started System Design Interview",
    time: "Yesterday",
    status: "In progress",
  },
  {
    id: 3,
    title: "Reviewed Behavioral Feedback",
    time: "2 days ago",
    status: "Completed",
  },
];