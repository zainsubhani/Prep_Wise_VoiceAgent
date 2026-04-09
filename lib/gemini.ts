type InterviewAnalysis = {
  overallScore: number;
  communication: number;
  technicalDepth: number;
  confidence: number;
  problemSolving: number;
  clarity: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  nextSteps: string[];
};

type OpenRouterChoice = {
  message?: {
    content?: string;
  };
};

type OpenRouterResponse = {
  choices?: OpenRouterChoice[];
  error?: {
    message?: string;
  };
};

function extractJsonFromText(text: string): string {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("Model response did not contain valid JSON.");
}

function validateAnalysis(data: unknown): InterviewAnalysis {
  if (typeof data !== "object" || data === null) {
    throw new Error("Analysis response is not an object.");
  }

  const obj = data as Record<string, unknown>;

  const requiredNumberFields = [
    "overallScore",
    "communication",
    "technicalDepth",
    "confidence",
    "problemSolving",
    "clarity",
  ];

  for (const key of requiredNumberFields) {
    if (typeof obj[key] !== "number") {
      throw new Error(`Missing or invalid numeric field: ${key}`);
    }
  }

  const requiredStringArrayFields = ["strengths", "improvements", "nextSteps"];

  for (const key of requiredStringArrayFields) {
    if (
      !Array.isArray(obj[key]) ||
      !(obj[key] as unknown[]).every((item) => typeof item === "string")
    ) {
      throw new Error(`Missing or invalid string[] field: ${key}`);
    }
  }

  if (typeof obj.summary !== "string") {
    throw new Error("Missing or invalid summary field: summary");
  }

  return {
    overallScore: obj.overallScore as number,
    communication: obj.communication as number,
    technicalDepth: obj.technicalDepth as number,
    confidence: obj.confidence as number,
    problemSolving: obj.problemSolving as number,
    clarity: obj.clarity as number,
    strengths: obj.strengths as string[],
    improvements: obj.improvements as string[],
    summary: obj.summary as string,
    nextSteps: obj.nextSteps as string[],
  };
}

export async function analyzeInterviewWithGemini(input: {
  role: string;
  company?: string;
  interviewType: string;
  difficulty: string;
  duration: number;
  transcript: string;
}): Promise<InterviewAnalysis> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const systemPrompt = `
You are an expert technical interviewer and evaluator.

Return ONLY valid JSON.
Do not wrap the JSON in markdown.
Do not add commentary before or after the JSON.

The JSON must match this shape exactly:
{
  "overallScore": number,
  "communication": number,
  "technicalDepth": number,
  "confidence": number,
  "problemSolving": number,
  "clarity": number,
  "strengths": string[],
  "improvements": string[],
  "summary": string,
  "nextSteps": string[]
}

Rules:
- All scores must be integers from 0 to 100.
- strengths must contain 2 to 4 short bullet-style strings.
- improvements must contain 2 to 4 short bullet-style strings.
- nextSteps must contain 2 to 4 actionable strings.
- summary must be concise and recruiter-style.
`;

  const userPrompt = `
Evaluate this mock interview.

Role: ${input.role}
Company: ${input.company || "General"}
Interview Type: ${input.interviewType}
Difficulty: ${input.difficulty}
Duration: ${input.duration} minutes

Transcript:
${input.transcript}
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  const data: OpenRouterResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to analyze interview.");
  }

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Model returned empty content.");
  }

  const jsonText = extractJsonFromText(content);
  const parsed = JSON.parse(jsonText) as unknown;

  return validateAnalysis(parsed);
}