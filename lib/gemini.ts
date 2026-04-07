import { GoogleGenAI, Type } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const feedbackSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER },
    communication: { type: Type.INTEGER },
    technicalDepth: { type: Type.INTEGER },
    confidence: { type: Type.INTEGER },
    problemSolving: { type: Type.INTEGER },
    clarity: { type: Type.INTEGER },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    improvements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    summary: { type: Type.STRING },
    nextSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    "overallScore",
    "communication",
    "technicalDepth",
    "confidence",
    "problemSolving",
    "clarity",
    "strengths",
    "improvements",
    "summary",
    "nextSteps",
  ],
};

export async function analyzeInterviewWithGemini(input: {
  role: string;
  company?: string;
  interviewType: string;
  difficulty: string;
  duration: number;
  transcript: string;
}) {
  const prompt = `
You are an expert technical interviewer and evaluator.

Evaluate this mock interview.

Role: ${input.role}
Company: ${input.company || "General"}
Interview Type: ${input.interviewType}
Difficulty: ${input.difficulty}
Duration: ${input.duration} minutes

Transcript:
${input.transcript}

Instructions:
- Be strict but fair.
- Score each category from 0 to 100.
- Keep strengths and improvements short and specific.
- nextSteps must be actionable.
- summary should be concise and recruiter-style.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: feedbackSchema,
      temperature: 0.4,
    },
  });

  const text = response.text;

if (!text) {
  throw new Error("Gemini returned no text response.");
}

return JSON.parse(text);
}