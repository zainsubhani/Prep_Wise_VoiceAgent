import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { analyzeInterviewWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      role,
      company,
      interviewType,
      difficulty,
      duration,
      transcript,
    } = body;

    if (!userId || !role || !interviewType || !difficulty || !duration || !transcript) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const analysis = await analyzeInterviewWithGemini({
      role,
      company,
      interviewType,
      difficulty,
      duration,
      transcript,
    });

    const docRef = await adminDb.collection("interviews").add({
      userId,
      role,
      company: company || "",
      interviewType,
      difficulty,
      duration,
      transcript,
      ...analysis,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      interviewId: docRef.id,
      analysis,
    });
  } catch (error) {
    console.error("Analyze route error:", error);
    return NextResponse.json(
      { error: "Failed to analyze interview." },
      { status: 500 }
    );
  }
}