import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function IdolsPage() {
  const members = await prisma.member.findMany({
    include: { boyGroup: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Daftar Idol</h1>
        <Link
          href="/admin/idols/new"
          className="px-4 py-2 rounded-md bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]"
        >
          + Tambah Idol
        </Link>
      </div>

      <table className="w-full text-left text-gray-200">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2">Stage Name</th>
            <th className="py-2">BoyGroup</th>
            <th className="py-2">Posisi</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-b border-gray-800">
              <td className="py-2">{m.stageName}</td>
              <td className="py-2">{m.boyGroup.name}</td>
              <td className="py-2">{m.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}