import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0000] relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/bg-hero.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0d0000]/90 to-[#0d0000]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-bold text-white">
          Dater<span className="text-red-500">XP</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
