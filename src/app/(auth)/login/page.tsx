"use client";

import { useActionState } from "react";
import { loginUser } from "@/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    async (_prevState: string | undefined, formData: FormData) => {
      return await loginUser(formData);
    },
    undefined
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm p-6 bg-gray-900 rounded">
        <h1 className="text-2xl font-bold text-white mb-2">Login</h1>
        
        <input name="email" type="text" placeholder="Email atau Username" required className="p-2 rounded bg-gray-800 text-white" />
        <input name="password" type="password" placeholder="Password" required className="p-2 rounded bg-gray-800 text-white" />

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <button type="submit" disabled={isPending} className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
          {isPending ? "Memproses..." : "Login"}
        </button>

        <p className="text-gray-400 text-sm text-center">
          Belum punya akun? <Link href="/register" className="text-[#39FF14]">Daftar</Link>
        </p>
      </form>
    </div>
  );
}