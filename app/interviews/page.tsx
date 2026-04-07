"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Interview } from "@/types/dashboard.types";



export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setInterviews([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "interviews"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as unknown as Interview[];

        setInterviews(data);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030711] text-white p-6">
        <p>Loading interviews...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030711] text-white p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Your Interviews</h1>

        {interviews.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No interviews found</h2>
            <p className="text-white/60">
              You have not taken any interviews yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="rounded-2xl border border-cyan-400/10 bg-white/5 p-5 shadow-lg backdrop-blur"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">{interview.role}</h2>
                  <p className="text-sm text-white/60">{interview.company}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-white/50">Score:</span>{" "}
                    <span className="font-medium text-cyan-400">
                      {interview.score ?? "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="text-white/50">Status:</span>{" "}
                    <span className="capitalize">{interview.status}</span>
                  </p>
                  {interview.feedback && (
                    <p className="text-white/70 line-clamp-3">
                      {interview.feedback}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}