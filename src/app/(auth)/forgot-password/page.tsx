"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-2xl p-8">
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-gray-400 text-sm mb-6">
              We sent a password reset link to <span className="text-white">{email}</span>
            </p>
            <Link href="/login" className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Link href="/login" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back
              </Link>
              <h1 className="text-2xl font-bold text-white mb-2">Reset password</h1>
              <p className="text-gray-400 text-sm">We&apos;ll send you a reset link</p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#1a0a0a] border border-red-900/30 text-white placeholder-gray-600 focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/40 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                style={{
                  background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
                  boxShadow: "0 0 16px rgba(255,26,26,0.3)",
                }}
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
