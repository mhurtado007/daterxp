"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError("Check your email to confirm your account before signing in.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-gray-400 text-sm">Start your journey to dating mastery</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              required
              placeholder="yourname"
              minLength={3}
              maxLength={20}
              pattern="[a-z0-9_]+"
              title="Lowercase letters, numbers, and underscores only"
              className="w-full px-4 py-3 rounded-xl bg-[#1a0a0a] border border-red-900/30 text-white placeholder-gray-600 focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/40 transition-all"
            />
          </div>

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

          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1a0a0a] border border-red-900/30 text-white placeholder-gray-600 focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
              boxShadow: "0 0 16px rgba(255,26,26,0.3)",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Start for Free"
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-600 text-center">
          By signing up you agree to our terms of service.
        </p>

        <div className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
