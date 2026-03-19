"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, User, LogOut, Zap, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/victory-road", icon: Swords, label: "Victory Road" },
  { href: "/courses", icon: BookOpen, label: "Courses" },
  { href: "/profile", icon: User, label: "Profile" },
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

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#0d0000] border-r border-red-900/20 p-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 mb-10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
            boxShadow: "0 0 12px rgba(255,26,26,0.4)",
          }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
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
