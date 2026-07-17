import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutUser } from "@/actions/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#39FF14]/20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white tracking-tight">
          DAEBAK<span className="text-[#39FF14]">LOG</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <Link href="/boygroups" className="hover:text-[#39FF14] transition-colors">Boy Group</Link>
          <Link href="/concerts" className="hover:text-[#39FF14] transition-colors">Konser</Link>
          <Link href="/albums" className="hover:text-[#39FF14] transition-colors">Album</Link>
          
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                Halo, <span className="text-white font-semibold">{session.user.name}</span>
                {session.user.role === "ADMIN" && (
                  <span className="ml-1 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black tracking-wide">ADMIN</span>
                )}
              </span>
              
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="text-[#39FF14] hover:underline font-semibold transition-colors">
                  Admin Panel
                </Link>
              )}

              <form action={logoutUser} className="inline">
                <button type="submit" className="text-red-400 hover:text-red-300 font-medium cursor-pointer transition-colors">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="hover:text-[#39FF14] transition-colors">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}