"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { useRouter } from "next/navigation";

type RoleOption =
  | "Frontend Developer"
  | "Backend Engineer"
  | "Software Engineer Intern";

type InterviewType = "Technical" | "Behavioral" | "Mixed";
type Difficulty = "Easy" | "Medium" | "Hard";





const ROLE_OPTIONS: RoleOption[] = [
  "Frontend Developer",
  "Backend Engineer",
  "Software Engineer Intern",
];
type TranscriptItem = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type TranscriptMessage = {
  type: "transcript";
  transcript: string;
  role: "assistant" | "user";
};

type VapiMessage = {
  type: string;
  transcript?: string;
  role?: "assistant" | "user";
};

function isTranscriptMessage(message: VapiMessage): message is TranscriptMessage {
  return (
    message.type === "transcript" &&
    typeof message.transcript === "string" &&
    (message.role === "assistant" || message.role === "user")
  );
}

const TYPE_OPTIONS: InterviewType[] = ["Technical", "Behavioral", "Mixed"];
const DIFFICULTY_OPTIONS: Difficulty[] = ["Easy", "Medium", "Hard"];
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

export default function TakeInterviewPage() {
    const [isOnline, setIsOnline] = useState(true);

  const router = useRouter();

  const vapiRef = useRef<Vapi | null>(null);
  const hasAnalyzedRef = useRef(false);
  useEffect(() => {
  const updateOnlineStatus = () => setIsOnline(navigator.onLine);

  updateOnlineStatus();
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  return () => {
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", updateOnlineStatus);
  };
}, []);

  const [role, setRole] = useState<RoleOption>("Frontend Developer");
  const [interviewType, setInterviewType] = useState<InterviewType>("Technical");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [duration, setDuration] = useState<number>(30);

  const [loading, setLoading] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [status, setStatus] = useState("Ready");
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  useEffect(() => {
    if (!isInterviewStarted) setTimeLeft(duration * 60);
  }, [duration, isInterviewStarted]);

  useEffect(() => {
    if (!isInterviewStarted || isInterviewEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          void endInterview(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInterviewStarted, isInterviewEnded]);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) return;

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setStatus("Call started");
      setIsInterviewStarted(true);
      setIsInterviewEnded(false);
      setError(null);
    });

    vapi.on("call-end", () => {
      setStatus("Call ended");
      setIsInterviewStarted(false);
      setIsInterviewEnded(true);

      if (!hasAnalyzedRef.current) {
        hasAnalyzedRef.current = true;
        void analyzeAndSave();
      }
    });

    vapi.on("speech-start", () => {
      setIsAssistantSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setIsAssistantSpeaking(false);
    });

    vapi.on("volume-level", (level: number) => {
      setVolumeLevel(level);
    });

  vapi.on("message", (message: VapiMessage) => {
  if (isTranscriptMessage(message)) {
    setTranscriptItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: message.role,
        text: message.transcript,
      },
    ]);
  }
});

    vapi.on("error", (e: undefined) => {
      console.error("Vapi error:", e);
      setError("Voice session failed. Please try again.");
      setStatus("Error");
    });

    return () => {
      try {
        vapi.stop();
      } catch {}
    };
  }, []);

  const transcriptText = transcriptItems
    .map((item) => `${item.role === "assistant" ? "Interviewer" : "Candidate"}: ${item.text}`)
    .join("\n");

const startInterview = async () => {
  try {
    setLoading(true);
    setError(null);
    setStatus("Connecting...");

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    if (!assistantId) {
      setError("Missing Vapi assistant id.");
      setStatus("Configuration error");
      return;
    }

    if (!vapiRef.current) {
      setError("Vapi client is not initialized.");
      setStatus("Initialization error");
      return;
    }

    hasAnalyzedRef.current = false;
    setTranscriptItems([]);
    setTimeLeft(duration * 60);

    await vapiRef.current.start(assistantId, {
   
        variableValues: {
          role,
          interviewType,
          difficulty,
          duration: String(duration),
        },
      
    });
  } catch (err) {
    console.error("Start interview failed:", err);
    setError("Unable to start interview.");
    setStatus("Failed to start");
  } finally {
    setLoading(false);
  }
};

  const endInterview = async (autoEnded = false) => {
    try {
      setStatus(autoEnded ? "Time is up" : "Ending...");
      await vapiRef.current?.say(
        autoEnded
          ? "Our interview time is over. Thank you. Ending the session now."
          : "Ending the interview now. Thank you.",
        true
      );
    } catch {
      await vapiRef.current?.stop();
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    vapiRef.current?.setMuted(next);
    setIsMuted(next);
  };

  const analyzeAndSave = async () => {
    try {
      setStatus("Analyzing interview...");

      const payload = {
        userId: "demo-user-id", // replace with current auth user uid
        role,
        company: "",
        interviewType,
        difficulty,
        duration,
        transcript: transcriptText,
      };

      const res = await fetch("/api/interview/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Analysis failed");
      }

      setStatus("Analysis complete");
      router.push(`/feedback/${data.interviewId}`);
    } catch (err) {
      console.error(err);
      setError("Interview ended, but analysis failed.");
      setStatus("Analysis failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#030711] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-xl border border-white/10 bg-[#081120] p-4">
  <p className="text-sm text-white/50">Network</p>
  <p className={`mt-1 font-medium ${isOnline ? "text-green-400" : "text-red-400"}`}>
    {isOnline ? "Online" : "Offline"}
  </p>
</div>
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Live AI Interview
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Take Interview
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60 md:text-base">
            Launch a voice interview, stream the transcript live, and generate AI feedback at the end.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold">Interview Setup</h2>
            <p className="mt-2 text-sm text-white/50">
              Select the role, format, difficulty, and duration.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/60">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleOption)}
                  disabled={isInterviewStarted}
                  className="w-full rounded-2xl border border-white/10 bg-[#081120] p-3 outline-none"
                >
                  {ROLE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">Interview Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                  disabled={isInterviewStarted}
                  className="w-full rounded-2xl border border-white/10 bg-[#081120] p-3 outline-none"
                >
                  {TYPE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  disabled={isInterviewStarted}
                  className="w-full rounded-2xl border border-white/10 bg-[#081120] p-3 outline-none"
                >
                  {DIFFICULTY_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {DURATION_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDuration(item)}
                      disabled={isInterviewStarted}
                      className={`rounded-xl px-3 py-2 text-sm transition ${
                        duration === item
                          ? "bg-cyan-400 text-black"
                          : "border border-white/10 bg-[#081120] text-white/70"
                      } ${isInterviewStarted ? "opacity-50" : ""}`}
                    >
                      {item}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-sm text-cyan-300">Timer</p>
              <h3 className="mt-2 text-4xl font-bold">{formattedTime}</h3>
              <p className="mt-2 text-sm text-white/60">Max interview length: {duration} minutes</p>
            </div>

            <div className="mt-6 flex gap-3">
              {!isInterviewStarted ? (
                <button
                  onClick={startInterview}
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-black disabled:opacity-60"
                >
                  {loading ? "Starting..." : "Start Interview"}
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleMute}
                    className="flex-1 rounded-2xl border border-white/10 bg-[#081120] px-5 py-3 font-semibold"
                  >
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    onClick={() => endInterview(false)}
                    className="flex-1 rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white"
                  >
                    End
                  </button>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}
          </section>

          <section className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/50">Current Status</p>
                    <h2 className="mt-1 text-2xl font-semibold">{status}</h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#081120] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Assistant
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {isAssistantSpeaking ? "Speaking" : "Listening"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-2 text-sm text-white/50">Voice Activity</p>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all"
                      style={{ width: `${Math.min(100, volumeLevel * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#081120] p-4">
                    <p className="text-sm text-white/50">Role</p>
                    <p className="mt-1 font-medium">{role}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#081120] p-4">
                    <p className="text-sm text-white/50">Type</p>
                    <p className="mt-1 font-medium">{interviewType}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#081120] p-4">
                    <p className="text-sm text-white/50">Difficulty</p>
                    <p className="mt-1 font-medium">{difficulty}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Interview Panel
                </p>

                <div className="mt-5 flex items-center justify-center">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10">
                    <div className="absolute inset-0 animate-pulse rounded-full border border-cyan-400/20" />
                    <div className="text-center">
                      <div className="mx-auto h-10 w-10 rounded-full bg-cyan-400/80" />
                      <p className="mt-3 text-sm text-white/70">AI Interviewer</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                  <p className="text-sm font-medium text-amber-300">Live Tip</p>
                  <p className="mt-2 text-sm text-white/70">
                    Keep answers structured. Use concise reasoning, examples, and trade-offs.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Live Transcript</h2>
                  <p className="mt-1 text-sm text-white/50">
                    Real-time conversation stream from the interview.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#081120] px-3 py-2 text-sm text-white/60">
                  {transcriptItems.length} messages
                </div>
              </div>

              <div className="mt-5 max-h-105 space-y-3 overflow-y-auto pr-2">
                {transcriptItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
                    The transcript will appear here once the call starts.
                  </div>
                ) : (
                  transcriptItems.map((item) => (
                    <div
                      key={item.id}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        item.role === "assistant"
                          ? "bg-cyan-400/10 border border-cyan-400/20"
                          : "ml-auto bg-white/5 border border-white/10"
                      }`}
                    >
                      <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/40">
                        {item.role === "assistant" ? "Interviewer" : "Candidate"}
                      </p>
                      <p className="text-sm text-white/85">{item.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}