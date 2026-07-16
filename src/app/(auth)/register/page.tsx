import { registerUser } from "@/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form action={registerUser} className="flex flex-col gap-4 w-full max-w-sm p-6 bg-gray-900 rounded">
        <h1 className="text-2xl font-bold text-white mb-2">Daftar Akun</h1>

        <input name="name" placeholder="Nama" required className="p-2 rounded bg-gray-800 text-white" />
        <input name="email" type="email" placeholder="Email" required className="p-2 rounded bg-gray-800 text-white" />
        <input name="password" type="password" placeholder="Password" required minLength={6} className="p-2 rounded bg-gray-800 text-white" />

        <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
          Daftar
        </button>

        <p className="text-gray-400 text-sm text-center">
          Sudah punya akun? <Link href="/login" className="text-[#39FF14]">Login</Link>
        </p>
      </form>
    </div>
  );
}