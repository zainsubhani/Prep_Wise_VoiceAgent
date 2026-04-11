"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { InterviewRecord } from "@/types/interview-history";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

type UseUserInterviewsResult = {
  interviews: InterviewRecord[];
  loading: boolean;
  error: string | null;
};

export function useUserInterviews(): UseUserInterviewsResult {
  const { user, loading: authLoading } = useAuth();
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const currentUser = user;

    if (!currentUser) {
      setInterviews([]);
      setError(null);
      setLoading(false);
      return;
    }

    async function loadInterviews(activeUser: User) {
      setLoading(true);
      setError(null);

      try {
        const idToken = await activeUser.getIdToken();
        const response = await fetch("/api/interviews", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          cache: "no-store",
        });

        const data = (await response.json()) as {
          interviews?: InterviewRecord[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Unable to load interviews.");
        }

        setInterviews(data.interviews ?? []);
      } catch (fetchError) {
        console.error("Error fetching user interviews:", fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load your interview history right now."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInterviews(currentUser);
  }, [authLoading, user]);

  return { interviews, loading, error };
}
