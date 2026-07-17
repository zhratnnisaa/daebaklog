import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function PublicConcertsPage() {
  const concerts = await prisma.concert.findMany({
    include: { boyGroup: true },
    orderBy: { date: "asc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Jadwal Konser</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concerts.map((c) => (
          <Link
            key={c.id}
            href={`/concerts/${c.id}`}
            className="flex gap-4 bg-gray-900 rounded-xl p-4 hover:shadow-[0_0_20px_#39FF14] transition-shadow"
          >
            {c.posterUrl ? (
              <Image src={c.posterUrl} alt={c.title} width={80} height={110} className="rounded-lg object-cover" />
            ) : (
              <div className="w-20 h-28 bg-gray-800 rounded-lg" />
            )}
            <div>
              <p className="text-white font-semibold">{c.title}</p>
              <p className="text-gray-400 text-sm">{c.boyGroup.name}</p>
              <p className="text-[#39FF14] text-sm mt-1">
                {new Date(c.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-gray-500 text-xs">{c.location} · Rp{c.price.toLocaleString("id-ID")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}