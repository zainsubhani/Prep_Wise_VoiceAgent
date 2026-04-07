export type Interview = {
  feedback: ReactNode;
  feedback: import("react/jsx-runtime").JSX.Element;
  status: ReactNode;
  company: ReactNode;
  role: ReactNode;
  id: number;
  title: string;
  category: string;
  description: string;
  icon: string;
  accent: string;
  actionLabel: string;
  date?: string;
  score?: string;
};

export type InterviewSectionProps = {
  title: string;
  interviews: Interview[];
};
export type DashboardStat = {
  label: string;
  value: string;
  subtext: string;
};

export type InterviewCategory = "Technical" | "Non-Technical";

export type InterviewCardItem = {
  id: number;
  title: string;
  category: InterviewCategory;
  description: string;
  icon: string;
  accent: string;
  actionLabel: string;
  date?: string;
  score?: string;
};

export type SkillProgressItem = {
  id: number;
  label: string;
  value: number;
};

export type RecentActivityItem = {
  id: number;
  title: string;
  time: string;
  status: string;
};