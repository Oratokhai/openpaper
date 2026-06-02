"use client";

import { useEffect, useState } from "react";
import { useSignUp } from "@clerk/nextjs/legacy";
import { useUser } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "form" | "verify";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // Already have a session (e.g. signed up via OAuth)? Skip the form.
  useEffect(() => {
    if (userLoaded && isSignedIn) router.replace("/home");
  }, [userLoaded, isSignedIn, router]);

  const [step, setStep] = useState<Step>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loading = submitting;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setSubmitting(true);

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        // Username is disabled on the Clerk instance, so we keep the @handle in
        // metadata and mirror it to our own users table in Phase 2.
        unsafeMetadata: { username },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "Could not create account.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/home");
      } else {
        setError("That code didn't work. Please try again.");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "Verification failed.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = (provider: "oauth_github" | "oauth_google") => {
    if (!isLoaded || isSignedIn) return;
    signUp.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/home",
    });
  };

  // Don't render any form until we know the visitor is signed out (prevents
  // clicking a provider while a session exists → "You're already signed in").
  if (!userLoaded || isSignedIn) {
    return <p className="text-[14px] text-[#858585]">Loading…</p>;
  }

  if (step === "verify") {
    return (
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 text-[#f5f3ee] hover:opacity-80 transition-opacity">
            <span className="text-3xl leading-none" style={{ fontFamily: "var(--font-fraunces)" }}>❦</span>
            <span className="text-xl font-medium tracking-tight" style={{ fontFamily: "var(--font-fraunces)" }}>Openpaper</span>
          </Link>
          <p className="text-[#858585] text-[14px] mt-3">Check your email</p>
        </div>

        <p className="text-[14px] text-[#888] text-center mb-8 leading-relaxed">
          We sent a 6-digit code to <span className="text-[#f5f3ee]">{email}</span>.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            required
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[22px] text-[#f5f3ee] text-center tracking-[0.3em] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#6366f1]/60 transition-all"
          />

          {error && (
            <p className="text-[13px] text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={!isLoaded || loading || code.length < 6}
            className="w-full py-3 rounded-xl bg-[#6366f1] text-white text-[14px] font-medium hover:bg-[#5457e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying…" : "Verify email"}
          </button>
        </form>

        <button onClick={() => setStep("form")} className="w-full text-center text-[13px] text-[#787878] hover:text-[#8d8d8d] transition-colors mt-5">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2.5 text-[#f5f3ee] hover:opacity-80 transition-opacity">
          <span className="text-3xl leading-none" style={{ fontFamily: "var(--font-fraunces)" }}>❦</span>
          <span className="text-xl font-medium tracking-tight" style={{ fontFamily: "var(--font-fraunces)" }}>Openpaper</span>
        </Link>
        <p className="text-[#858585] text-[14px] mt-3">Write about what you build with AI</p>
      </div>

      <div className="space-y-3 mb-6">
        <OAuthButton provider="github" onClick={() => handleOAuth("oauth_github")}>Continue with GitHub</OAuthButton>
        <OAuthButton provider="google" onClick={() => handleOAuth("oauth_google")}>Continue with Google</OAuthButton>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[12px] text-[#6e6e6e]">or sign up with email</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] text-[#8d8d8d] mb-2">First name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ada" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/[0.06] transition-all" />
          </div>
          <div>
            <label className="block text-[12px] text-[#8d8d8d] mb-2">Last name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Lovelace" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/[0.06] transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-[12px] text-[#8d8d8d] mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/[0.06] transition-all" />
        </div>

        <div>
          <label className="block text-[12px] text-[#8d8d8d] mb-2">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#6e6e6e] pointer-events-none">@</span>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="adalovelace" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/[0.06] transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-[12px] text-[#8d8d8d] mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/[0.06] transition-all" />
        </div>

        {error && (
          <p className="text-[13px] text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5">{error}</p>
        )}

        {/* Clerk renders its bot-protection (Smart CAPTCHA / Turnstile) widget here.
            Required for custom sign-up flows — without it, create() fails with captcha_invalid. */}
        <div id="clerk-captcha" className="empty:hidden flex justify-center" />

        <button type="submit" disabled={!isLoaded || loading} className="w-full py-3 rounded-xl bg-[#6366f1] text-white text-[14px] font-medium hover:bg-[#5457e0] transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-[12px] text-[#6e6e6e] mt-4 leading-relaxed">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="text-[#858585] hover:text-[#888] transition-colors underline underline-offset-2">Terms</Link>{" "}and{" "}
        <Link href="/privacy" className="text-[#858585] hover:text-[#888] transition-colors underline underline-offset-2">Privacy Policy</Link>.
      </p>

      <p className="text-center text-[14px] text-[#858585] mt-6">
        Already have an account?{" "}
        <Link href="/signin" className="text-[#888] hover:text-[#f5f3ee] transition-colors">Sign in</Link>
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
