import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID");
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error("Missing FIREBASE_CLIENT_EMAIL");
}

if (!privateKey) {
  throw new Error("Missing FIREBASE_PRIVATE_KEY");
}
console.log("ADMIN PROJECT ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("ADMIN CLIENT EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("PRIVATE KEY PRESENT:", !!privateKey);
const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });

export const adminDb = getFirestore(app);