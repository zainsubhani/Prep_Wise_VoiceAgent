import { adminAuth } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";

export async function getAuthenticatedUserId(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing authorization token.");
  }

  const idToken = authHeader.slice("Bearer ".length).trim();

  if (!idToken) {
    throw new Error("Missing authorization token.");
  }

  const decodedToken = await adminAuth.verifyIdToken(idToken);
  return decodedToken.uid;
}
