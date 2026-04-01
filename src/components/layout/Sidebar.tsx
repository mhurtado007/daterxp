"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, LogOut, Flame, CreditCard, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/victory-road", icon: Flame, label: "Victory Road" },
  { href: "/approach-warm-up", icon: Target, label: "Approach Warm-Up" },
  { href: "/courses", icon: BookOpen, label: "Courses" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleBilling() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#0d0000] border-r border-red-900/20 p-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 mb-10">
        <span className="text-xl font-bold text-white">
          Dater<span className="text-red-500">XP</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-red-950/50 text-red-400 border border-red-900/40"
                  : "text-gray-500 hover:text-gray-200 hover:bg-red-950/20"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-red-500" : "")} />
              {label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Billing */}
      <button
        onClick={handleBilling}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-200 hover:bg-red-950/20 transition-all duration-200 mb-1"
      >
        <CreditCard className="w-5 h-5" />
        Billing
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-300 hover:bg-red-950/20 transition-all duration-200"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </aside>
  );
}
