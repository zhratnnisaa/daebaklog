import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function PublicBoyGroupsPage() {
  const boyGroups = await prisma.boyGroup.findMany({
    orderBy: { debutYear: "desc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Ensiklopedia Boy Group</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {boyGroups.map((bg) => (
          <Link
            key={bg.id}
            href={`/boygroups/${bg.id}`}
            className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-[0_0_15px_#39FF14] transition-shadow"
          >
            {bg.logoUrl ? (
              <Image src={bg.logoUrl} alt={bg.name} width={300} height={300} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-gray-800" />
            )}
            <div className="p-3">
              <p className="text-white font-semibold">{bg.name}</p>
              <p className="text-sm text-gray-400">{bg.agency} · Debut {bg.debutYear}</p>
              <p className="text-xs text-[#39FF14] mt-1">{bg._count.members} member</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}