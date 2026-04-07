"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

const features = [
  "Monthly practical courses",
  "Confidence & mindset training",
  "Conversation skills mastery",
  "Simplified Dating Roadmap",
  "Learn to convert dates without overthinking",
];

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0000] flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="mb-12 text-xl font-bold text-white">
        Dater<span className="text-red-500">XP</span>
      </Link>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl border border-red-900/40 bg-[#130000] p-8"
        style={{ boxShadow: "0 0 60px rgba(255,26,26,0.08)" }}
      >
        {/* Price */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm mb-2">Full access, cancel anytime</p>
          <div className="flex items-end justify-center gap-1">
            <span className="text-5xl font-bold text-white">$29</span>
            <span className="text-gray-400 text-lg mb-2">/month</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
              <Check className="w-4 h-4 text-red-500 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #ff4444 0%, #cc0000 100%)",
            boxShadow: loading ? "none" : "0 0 30px rgba(255,26,26,0.3)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            "Start Trial"
          )}
        </button>

        <p className="text-center text-gray-600 text-xs mt-4">
          Cancel anytime.
        </p>
      </div>

      <p className="mt-8 text-gray-600 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-red-500 hover:text-red-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
