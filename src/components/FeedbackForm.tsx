"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setMessage("");
    setLoading(false);
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Send Feedback</h2>
      <p className="text-gray-500 text-sm mb-4">Let us know what you think or report an issue.</p>

      {submitted ? (
        <div className="py-6 text-center">
          <p className="text-green-400 font-medium">Thanks for your feedback!</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="Your feedback..."
            className="w-full px-4 py-3 rounded-xl bg-[#1a0a0a] border border-red-900/30 text-white placeholder-gray-600 focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/40 transition-all resize-none"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
              boxShadow: "0 0 16px rgba(255,26,26,0.2)",
            }}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
