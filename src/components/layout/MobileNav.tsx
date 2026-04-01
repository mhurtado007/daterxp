"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Flame, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/victory-road", icon: Flame, label: "Roadmap" },
  { href: "/courses", icon: BookOpen, label: "Courses" },
];

export function MobileNav() {
  const pathname = usePathname();

  async function handleBilling() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0000]/95 backdrop-blur-md border-t border-red-900/20">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-xs font-medium transition-all",
                isActive ? "text-red-400" : "text-gray-600 hover:text-gray-400"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-red-500")} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={handleBilling}
          className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-400 transition-all"
        >
          <CreditCard className="w-5 h-5" />
          Billing
        </button>
      </div>
    </nav>
  );
}
