export type RoleOption =
  | "Frontend Developer"
  | "Backend Engineer"
  | "Software Engineer Intern";

export type InterviewType = "Technical" | "Behavioral" | "Mixed";
export type Difficulty = "Easy" | "Medium" | "Hard";
export const ROLE_OPTIONS: RoleOption[] = [
  "Frontend Developer",
  "Backend Engineer",
  "Software Engineer Intern",
];
export  type TranscriptItem = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export type TranscriptMessage = {
  type: "transcript";
  transcript: string;
  role: "assistant" | "user";
};

export type VapiMessage = {
  type: string;
  transcript?: string;
  role?: "assistant" | "user";
};
