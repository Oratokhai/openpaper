"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function SignOutPage() {
  const { signOut } = useClerk();

  useEffect(() => {
    // Clears the browser-side dev session, then drops you on the sign-in page.
    signOut({ redirectUrl: "/signin" });
  }, [signOut]);

  return <p className="text-[14px] text-[#858585]">Signing you out…</p>;
}
