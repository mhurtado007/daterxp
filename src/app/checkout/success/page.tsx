"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Setting up your account...");

  useEffect(() => {
    const supabase = createClient();
    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(async () => {
      attempts++;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        clearInterval(interval);
        router.push("/login");
        return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();

      const isActive = sub?.status === "active" || sub?.status === "trialing";

      if (isActive) {
        clearInterval(interval);
        router.push("/dashboard");
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setMessage("Taking longer than expected... redirecting.");
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0d0000] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
