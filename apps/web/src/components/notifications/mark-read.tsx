"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markNotificationsRead } from "@/lib/social-actions";

/** Marks all notifications read when the page mounts, then refreshes the bell badge. */
export function MarkNotificationsRead() {
  const router = useRouter();
  useEffect(() => {
    markNotificationsRead().then(() => router.refresh());
  }, [router]);
  return null;
}
