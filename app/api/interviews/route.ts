import { adminDb } from "@/lib/firebase-admin";
import { getAuthenticatedUserId } from "@/lib/server-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    let snapshot;

    try {
      snapshot = await adminDb
        .collection("interviews")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const needsIndex =
        message.includes("FAILED_PRECONDITION") &&
        message.includes("The query requires an index");

      if (!needsIndex) {
        throw error;
      }

      snapshot = await adminDb
        .collection("interviews")
        .where("userId", "==", userId)
        .get();
    }

    const interviews = snapshot.docs
      .map((doc): { id: string; createdAt?: unknown; [key: string]: unknown } => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        const first = new Date(String(a.createdAt ?? "")).getTime();
        const second = new Date(String(b.createdAt ?? "")).getTime();

        return second - first;
      });

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Fetch interviews route error:", error);

    const message =
      error instanceof Error ? error.message : "Unable to fetch interviews.";
    const status = message === "Missing authorization token." ? 401 : 403;

    return NextResponse.json({ error: message }, { status });
  }
}
