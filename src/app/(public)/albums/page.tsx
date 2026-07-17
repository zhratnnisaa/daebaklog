import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function PublicAlbumsPage() {
  const albums = await prisma.album.findMany({
    include: { boyGroup: true },
    orderBy: { releaseDate: "desc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Album</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {albums.map((a) => (
          <Link
            key={a.id}
            href={`/albums/${a.id}`}
            className="group rounded-xl overflow-hidden bg-gray-900 hover:shadow-[0_0_20px_#39FF14] transition-shadow"
          >
            {a.coverUrl ? (
              <Image src={a.coverUrl} alt={a.title} width={250} height={250} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <div className="w-full aspect-square bg-gray-800" />
            )}
            <div className="p-3">
              <p className="text-white text-sm font-semibold truncate">{a.title}</p>
              <p className="text-gray-500 text-xs">{a.boyGroup.name}</p>
              <p className="text-[#39FF14] text-xs mt-1">Rp{a.price.toLocaleString("id-ID")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}