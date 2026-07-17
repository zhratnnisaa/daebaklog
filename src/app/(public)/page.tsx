import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const [featuredBoyGroups, upcomingConcerts, latestAlbums] = await Promise.all([
    prisma.boyGroup.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    prisma.concert.findMany({
      where: { date: { gte: new Date() } },
      include: { boyGroup: true },
      orderBy: { date: "asc" },
      take: 4,
    }),
    prisma.album.findMany({
      include: { boyGroup: true },
      orderBy: { releaseDate: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div className="bg-black min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute inset-0 bg-linear-to-b from-[#39FF14]/10 via-transparent to-transparent" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-[#39FF14] text-sm font-semibold tracking-[0.3em] mb-4">YOUR K-POP UNIVERSE</p>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Semua Tentang <span className="text-[#39FF14] drop-shadow-[0_0_20px_#39FF14]">Boy Group</span> Favoritmu
          </h1>
          <p className="text-gray-400 mb-8">
            Ensiklopedia idol, jadwal konser, dan album terbaru — semua dalam satu tempat.
          </p>
          <Link
            href="/boygroups"
            className="inline-block bg-[#39FF14] text-black font-bold px-8 py-3 rounded-full shadow-[0_0_25px_#39FF14] hover:scale-105 transition-transform"
          >
            Jelajahi Boy Group
          </Link>
        </div>
      </section>

      {/* FEATURED BOYGROUPS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Boy Group Populer</h2>
          <Link href="/boygroups" className="text-[#39FF14] text-sm hover:underline">Lihat semua →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {featuredBoyGroups.map((bg) => (
            <Link
              key={bg.id}
              href={`/boygroups/${bg.id}`}
              className="group rounded-xl overflow-hidden bg-gray-900 hover:shadow-[0_0_20px_#39FF14] transition-shadow"
            >
              {bg.logoUrl ? (
                <Image src={bg.logoUrl} alt={bg.name} width={200} height={200} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full aspect-square bg-gray-800" />
              )}
              <p className="text-white text-sm font-semibold p-2 truncate">{bg.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* UPCOMING CONCERTS */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Jadwal Konser Terdekat</h2>
          <Link href="/concerts" className="text-[#39FF14] text-sm hover:underline">Lihat semua →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingConcerts.map((c) => (
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
                <p className="text-gray-500 text-xs">{c.location}</p>
              </div>
            </Link>
          ))}
          {upcomingConcerts.length === 0 && (
            <p className="text-gray-500 text-sm">Belum ada jadwal konser mendatang.</p>
          )}
        </div>
      </section>

      {/* LATEST ALBUMS */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Album Terbaru</h2>
          <Link href="/albums" className="text-[#39FF14] text-sm hover:underline">Lihat semua →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latestAlbums.map((a) => (
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
          {latestAlbums.length === 0 && (
            <p className="text-gray-500 text-sm">Belum ada album.</p>
          )}
        </div>
      </section>
    </div>
  );
}