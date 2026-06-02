"use client";

import { useEffect, useState } from "react";
import { useSignIn } from "@clerk/nextjs/legacy";
import { useUser } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loading = submitting;

  // If a session already exists (e.g. after an OAuth round-trip), don't show the
  // form — Clerk throws "You're already signed in" if you try to sign in again.
  useEffect(() => {
    if (userLoaded && isSignedIn) router.replace("/home");
  }, [userLoaded, isSignedIn, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setSubmitting(true);

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/home");
      } else {
        setError("Additional verification is required to sign in.");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "Sign in failed.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = (provider: "oauth_github" | "oauth_google") => {
    if (isSignedIn) {
      router.push("/home");
      return;
    }
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/home",
    });
  };

  // Don't render the form until we know the visitor is signed out. While auth
  // resolves (or if already signed in and redirecting), show a loader so the
  // OAuth buttons can't be clicked into a "You're already signed in" error.
  if (!userLoaded || isSignedIn) {
    return <p className="text-[14px] text-[#858585]">Loading…</p>;
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2.5 text-[#f5f3ee] hover:opacity-80 transition-opacity">
          <span className="text-3xl leading-none" style={{ fontFamily: "var(--font-fraunces)" }}>❦</span>
          <span className="text-xl font-medium tracking-tight" style={{ fontFamily: "var(--font-fraunces)" }}>Openpaper</span>
        </Link>
        <p className="text-[#858585] text-[14px] mt-3">Welcome back</p>
      </div>

      <div className="space-y-3 mb-6">
        <OAuthButton provider="github" onClick={() => handleOAuth("oauth_github")}>Continue with GitHub</OAuthButton>
        <OAuthButton provider="google" onClick={() => handleOAuth("oauth_google")}>Continue with Google</OAuthButton>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[12px] text-[#6e6e6e]">or sign in with email</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <label className="block text-[12px] text-[#8d8d8d] mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#606c38]/60 focus:bg-white/[0.06] transition-all"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12px] text-[#8d8d8d]">Password</label>
            <Link href="/forgot-password" className="text-[12px] text-[#858585] hover:text-[#8d8d8d] transition-colors">Forgot password?</Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#606c38]/60 focus:bg-white/[0.06] transition-all"
          />
        </div>

        {error && (
          <p className="text-[13px] text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <button
          type="submit"
          disabled={!isLoaded || loading}
          className="w-full py-3 rounded-xl bg-[#606c38] text-white text-[14px] font-medium hover:bg-[#283618] transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-[14px] text-[#858585] mt-8">
        No account?{" "}
        <Link href="/signup" className="text-[#888] hover:text-[#f5f3ee] transition-colors">Start writing</Link>
      </p>
    </div>
  );
}

function OAuthButton({ provider, onClick, children }: { provider: "github" | "google"; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-[14px] text-[#aaa] hover:text-[#f5f3ee] hover:bg-white/[0.05] hover:border-white/[0.16] transition-all">
      {provider === "github" && (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      )}
      {provider === "google" && (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}
      {children}
    </button>
  );
}
