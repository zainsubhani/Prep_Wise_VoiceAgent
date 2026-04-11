export type LiveInterviewWindowState = {
  isOpen: boolean;
  role: string;
  interviewType: string;
  difficulty: string;
  duration: number;
  formattedTime: string;
  status: string;
  isMuted: boolean;
  isAssistantSpeaking: boolean;
  normalizedVolume: number;
  transcriptItems: Array<{
    id: string;
    role: "assistant" | "user";
    text: string;
  }>;
  userName: string;
};
