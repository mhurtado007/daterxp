import { HeroSection } from "@/components/landing/HeroSection";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-[#0d0000]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-red-900/20">
        <Link href="/" className="text-xl font-bold text-white">
          Dater<span className="text-red-500">XP</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/subscribe"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
              boxShadow: "0 0 12px rgba(255,26,26,0.3)",
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <HeroSection />
    </main>
  );
}
