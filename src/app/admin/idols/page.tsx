import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { deleteMember } from "@/actions/member";

export default async function IdolsPage() {
  const members = await prisma.member.findMany({
    include: { boyGroup: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Daftar Idol</h1>
        <Link href="/admin/idols/new" className="bg-[#39FF14] text-black px-4 py-2 rounded font-semibold">
          + Tambah Idol
        </Link>
      </div>

      <div className="grid gap-3">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-4 bg-gray-800 p-3 rounded">
            {m.photoUrl ? (
              <Image src={m.photoUrl} alt={m.stageName} width={48} height={48} className="w-12 h-12 object-cover rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-700" />
            )}

            <div className="flex-1 text-white">
              <p className="font-semibold">{m.stageName}</p>
              <p className="text-sm text-gray-400">{m.boyGroup.name} — {m.position}</p>
            </div>

            <Link href={`/admin/idols/${m.id}/edit`} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">
              Edit
            </Link>

            <form action={deleteMember.bind(null, m.id)}>
              <button type="submit" className="text-sm px-3 py-1 rounded bg-red-600 text-white">
                Hapus
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}