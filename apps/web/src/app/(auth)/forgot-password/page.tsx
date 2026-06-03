"use client";

import { useEffect, useState } from "react";
import { useSignIn } from "@clerk/nextjs/legacy";
import { useUser } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "request" | "reset";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userLoaded && isSignedIn) router.replace("/home");
  }, [userLoaded, isSignedIn, router]);

  if (!userLoaded || isSignedIn) {
    return <p className="text-[14px] text-[#858585]">Loading…</p>;
  }

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setSubmitting(true);
    try {
      await signIn.create({ strategy: "reset_password_email_code", identifier: email });
      setStep("reset");
    } catch (err) {
      setError(
        isClerkAPIResponseError(err)
          ? err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "Could not send a reset code."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setSubmitting(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/home");
      } else {
        setError("Couldn't reset your password. Please try again.");
      }
    } catch (err) {
      setError(
        isClerkAPIResponseError(err)
          ? err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "Reset failed."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2.5 text-[#f5f3ee] hover:opacity-80 transition-opacity">
          <span className="text-3xl leading-none" style={{ fontFamily: "var(--font-fraunces)" }}>❦</span>
          <span className="text-xl font-medium tracking-tight" style={{ fontFamily: "var(--font-fraunces)" }}>Openpaper</span>
        </Link>
        <p className="text-[#858585] text-[14px] mt-3">
          {step === "request" ? "Reset your password" : "Check your email"}
        </p>
      </div>

      {step === "request" ? (
        <form onSubmit={sendCode} className="space-y-4">
          <div>
            <label className="block text-[12px] text-[#8d8d8d] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#ff6b5c]/60 focus:bg-white/[0.06] transition-all"
            />
          </div>
          {error && (
            <p className="text-[13px] text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5">{error}</p>
          )}
          <button
            type="submit"
            disabled={!isLoaded || submitting}
            className="w-full py-3 rounded-xl bg-[#ff6b5c] text-white text-[14px] font-medium hover:bg-[#e8513f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending…" : "Send reset code"}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="space-y-4">
          <p className="text-[14px] text-[#8d8d8d] text-center mb-2 leading-relaxed">
            We sent a code to <span className="text-[#f5f3ee]">{email}</span>. Enter it with your new password.
          </p>
          <div>
            <label className="block text-[12px] text-[#8d8d8d] mb-2">Reset code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[18px] text-[#f5f3ee] text-center tracking-[0.3em] placeholder:text-[#3a3a3a] focus:outline-none focus:border-[#ff6b5c]/60 transition-all"
            />
          </div>
          <div>
            <label className="block text-[12px] text-[#8d8d8d] mb-2">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#ff6b5c]/60 focus:bg-white/[0.06] transition-all"
            />
          </div>
          {error && (
            <p className="text-[13px] text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5">{error}</p>
          )}
          <button
            type="submit"
            disabled={!isLoaded || submitting || code.length < 6}
            className="w-full py-3 rounded-xl bg-[#ff6b5c] text-white text-[14px] font-medium hover:bg-[#e8513f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Resetting…" : "Reset password & sign in"}
          </button>
          <button type="button" onClick={() => setStep("request")} className="w-full text-center text-[13px] text-[#6e6e6e] hover:text-[#8d8d8d] transition-colors">
            ← Use a different email
          </button>
        </form>
      )}

      <p className="text-center text-[14px] text-[#858585] mt-8">
        Remembered it?{" "}
        <Link href="/signin" className="text-[#8d8d8d] hover:text-[#f5f3ee] transition-colors">Sign in</Link>
      </p>
    </div>
  );
}
