import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
   Credentials({
  async authorize(credentials) {
    const email = credentials.email as string;
    const password = credentials.password as string;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    let role = user.role;

    // Auto-promote khusus email "admin123"
    if (email === "admin123" && role !== "ADMIN") {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      });
      role = updated.role;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    };
  },
}),
  ],
});