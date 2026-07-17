import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#39FF14]/20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white tracking-tight">
          DAEBAK<span className="text-[#39FF14]">LOG</span>
        </Link>
        <div className="flex gap-6 text-sm text-gray-300">
          <Link href="/boygroups" className="hover:text-[#39FF14] transition-colors">Boy Group</Link>
          <Link href="/concerts" className="hover:text-[#39FF14] transition-colors">Konser</Link>
          <Link href="/albums" className="hover:text-[#39FF14] transition-colors">Album</Link>
          <Link href="/login" className="hover:text-[#39FF14] transition-colors">Login</Link>
        </div>
      </div>
    </nav>
  );
}