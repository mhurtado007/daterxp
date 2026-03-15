import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CoursesPreview } from "@/components/landing/CoursesPreview";
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
            href="/signup"
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
      <FeaturesSection />
      <CoursesPreview />

      {/* Final CTA section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-red opacity-30 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join DaterXP today and start earning XP toward the dating life you deserve.
            It&apos;s free to start.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
              boxShadow: "0 0 30px rgba(255,26,26,0.5), 0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            Start for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-red-900/20 text-center text-gray-600 text-sm">
        <p>© 2025 DaterXP. Level up your dating life.</p>
      </footer>
    </main>
  );
}
