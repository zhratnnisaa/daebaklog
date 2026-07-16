import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { deleteBoyGroup } from "@/actions/boygroup";

export default async function BoyGroupsPage() {
  const boyGroups = await prisma.boyGroup.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Daftar BoyGroup</h1>
        <Link href="/admin/boygroups/new" className="bg-[#39FF14] text-black px-4 py-2 rounded font-semibold">
          + Tambah BoyGroup
        </Link>
      </div>

      <div className="grid gap-3">
        {boyGroups.map((bg) => (
          <div key={bg.id} className="flex items-center gap-4 bg-gray-800 p-3 rounded">
            {bg.logoUrl ? (
              <Image src={bg.logoUrl} alt={bg.name} width={48} height={48} className="w-12 h-12 object-cover rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-700" />
            )}

            <div className="flex-1 text-white">
              <p className="font-semibold">{bg.name}</p>
              <p className="text-sm text-gray-400">{bg.agency} — Debut {bg.debutYear}</p>
            </div>

            <Link href={`/admin/boygroups/${bg.id}/edit`} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">
              Edit
            </Link>

            <form action={deleteBoyGroup.bind(null, bg.id)}>
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