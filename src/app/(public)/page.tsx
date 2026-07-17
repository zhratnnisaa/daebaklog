import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const [featuredBoyGroups, upcomingConcerts, latestAlbums, fandomPhotos, comebackSchedules] = await Promise.all([
    prisma.boyGroup.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    prisma.concert.findMany({
      include: { boyGroup: true },
      orderBy: { date: "asc" },
      take: 4,
    }),
    prisma.album.findMany({
      include: { boyGroup: true },
      orderBy: { releaseDate: "desc" },
      take: 4,
    }),
    prisma.fandomPhoto.findMany({
      include: { boyGroup: true },
      take: 4,
      orderBy: { createdAt: "desc" }
    }),
    prisma.comebackSchedule.findMany({
      include: { boyGroup: true },
      orderBy: { date: "asc" },
      take: 4
    })
  ]);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-[#39FF14] selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-24 px-6 text-center border-b border-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-[#39FF14]/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block bg-gray-950/60 border border-[#39FF14]/30 px-4 py-1.5 rounded-full text-xs font-black text-[#39FF14] tracking-[0.2em] uppercase mb-6 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
            🌟 ENSIKLOPEDIA BABY K-POPERS
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Temukan Dunia <span className="text-[#39FF14] drop-shadow-[0_0_20px_#39FF14]">K-Pop</span> Bersama Kami!
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Ensiklopedia idol, lirik, album, konser terdekat, dan jadwal comeback untuk menuntun langkah pertamamu sebagai K-Popers sejati.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boygroups"
              className="bg-[#39FF14] text-black font-bold px-8 py-3.5 rounded-full shadow-[0_0_25px_#39FF14] hover:scale-105 transition-all text-sm uppercase tracking-wider"
            >
              Jelajahi Boy Group
            </Link>
            <Link
              href="/albums"
              className="bg-gray-950 border border-gray-800 text-white font-bold px-8 py-3.5 rounded-full hover:bg-gray-900 transition-all text-sm uppercase tracking-wider"
            >
              Beli Album & Lagu
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FANDOM GALLERY (FOTO FANDOM) */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-[#39FF14] text-xs font-black tracking-widest uppercase">✨ Fandom Gallery</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">Lautan Cahaya Fandom</h2>
          <p className="text-gray-400 text-sm mt-1">Pesona keindahan warna-warni lautan lightstick dari berbagai boy group.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fandomPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden bg-gray-950 border border-gray-900 hover:border-[#39FF14]/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(57,255,20,0.15)] transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video sm:aspect-square w-full overflow-hidden">
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption || "Fandom Photo"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 bg-[#39FF14] text-black text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow">
                  {photo.boyGroup.name}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-gray-950 to-black">
                <p className="text-gray-300 text-xs italic leading-relaxed">
                  &ldquo;{photo.caption}&rdquo;
                </p>
                <div className="mt-3 pt-3 border-t border-gray-900 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Fandom Photo</span>
                  <Link
                    href={`/boygroups/${photo.boyGroupId}`}
                    className="text-[#39FF14] text-[10px] font-bold hover:underline"
                  >
                    Detail Group →
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {fandomPhotos.length === 0 && (
            <div className="col-span-full bg-gray-950/40 border border-gray-900 p-8 rounded-xl text-center text-gray-500 text-sm">
              Belum ada foto fandom terkini.
            </div>
          )}
        </div>
      </section>

      {/* 3. SCHEDULES (COMEBACK & CONCERTS SIDE-BY-SIDE) */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-950 bg-gradient-to-b from-transparent via-gray-950/20 to-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Comeback Schedules */}
          <div>
            <div className="mb-6 flex justify-between items-end">
              <div>
                <p className="text-[#39FF14] text-xs font-black tracking-widest uppercase">📅 Coming Soon</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">Jadwal Comeback</h3>
              </div>
              <span className="text-[10px] text-gray-500 font-semibold">Waktu rilis resmi</span>
            </div>

            <div className="space-y-4">
              {comebackSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex gap-4 p-4 rounded-xl bg-gray-950 border border-gray-900 hover:border-[#39FF14]/30 hover:bg-gray-900/40 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg p-2.5 min-w-[70px] border border-gray-800">
                    <span className="text-[10px] text-[#39FF14] font-black uppercase tracking-wider">
                      {schedule.type}
                    </span>
                    <span className="text-xl font-black text-white mt-1">
                      {new Date(schedule.date).getDate()}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                      {new Date(schedule.date).toLocaleDateString("id-ID", { month: "short" })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[9px] bg-emerald-950 text-[#39FF14] font-bold px-2 py-0.5 rounded mb-1">
                      {schedule.boyGroup.name}
                    </span>
                    <h4 className="text-white text-sm font-bold truncate leading-tight">
                      {schedule.title}
                    </h4>
                    <p className="text-gray-500 text-[10px] mt-1">
                      Rilis pada: {new Date(schedule.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                    </p>
                  </div>
                </div>
              ))}
              {comebackSchedules.length === 0 && (
                <p className="text-gray-500 text-sm bg-gray-950/20 p-6 rounded-xl border border-gray-900 text-center">
                  Belum ada jadwal comeback terdekat.
                </p>
              )}
            </div>
          </div>

          {/* Upcoming Concerts */}
          <div>
            <div className="mb-6 flex justify-between items-end">
              <div>
                <p className="text-[#39FF14] text-xs font-black tracking-widest uppercase">🎤 Live Stage</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">Jadwal Konser Terdekat</h3>
              </div>
              <Link href="/concerts" className="text-[#39FF14] text-xs hover:underline">Lihat semua →</Link>
            </div>

            <div className="space-y-4">
              {upcomingConcerts.map((c) => (
                <Link
                  key={c.id}
                  href={`/concerts/${c.id}`}
                  className="flex gap-4 bg-gray-950 border border-gray-900 rounded-xl p-4 hover:border-[#39FF14]/30 hover:bg-gray-900/40 transition-all duration-300"
                >
                  <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                    {c.posterUrl ? (
                      <Image src={c.posterUrl} alt={c.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[9px] bg-emerald-950 text-[#39FF14] font-bold px-2 py-0.5 rounded mb-1">
                      {c.boyGroup.name}
                    </span>
                    <h4 className="text-white text-sm font-bold truncate leading-tight">{c.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(c.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="text-gray-500 text-[10px] mt-0.5 truncate">{c.location}</p>
                  </div>
                </Link>
              ))}
              {upcomingConcerts.length === 0 && (
                <p className="text-gray-500 text-sm bg-gray-950/20 p-6 rounded-xl border border-gray-900 text-center">
                  Belum ada jadwal konser mendatang.
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 4. POPULAR BOYGROUPS (ENCYCLOPEDIA GATEWAY) */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-950">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#39FF14] text-xs font-black tracking-widest uppercase">🗂️ Ensiklopedia Idol</p>
            <h2 className="text-3xl font-extrabold text-white mt-1">Jelajahi Boy Group</h2>
          </div>
          <Link href="/boygroups" className="text-[#39FF14] text-sm hover:underline">Lihat semua →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredBoyGroups.map((bg) => (
            <Link
              key={bg.id}
              href={`/boygroups/${bg.id}`}
              className="group rounded-2xl overflow-hidden bg-gray-950 border border-gray-900 hover:border-[#39FF14]/50 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-900">
                {bg.logoUrl ? (
                  <Image src={bg.logoUrl} alt={bg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-800" />
                )}
              </div>
              <div className="p-3 text-center bg-gradient-to-b from-gray-950 to-black">
                <p className="text-white text-sm font-bold truncate group-hover:text-[#39FF14] transition-colors">{bg.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{bg.agency}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. LATEST ALBUMS */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-950">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#39FF14] text-xs font-black tracking-widest uppercase">💿 Koleksi Album</p>
            <h2 className="text-3xl font-extrabold text-white mt-1">Album Terbaru</h2>
          </div>
          <Link href="/albums" className="text-[#39FF14] text-sm hover:underline">Lihat semua →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {latestAlbums.map((a) => (
            <Link
              key={a.id}
              href={`/albums/${a.id}`}
              className="group rounded-2xl overflow-hidden bg-gray-950 border border-gray-900 hover:border-[#39FF14]/50 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-900">
                {a.coverUrl ? (
                  <Image src={a.coverUrl} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-800" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <div className="bg-[#39FF14] text-black rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-b from-gray-950 to-black">
                <p className="text-white text-sm font-bold truncate group-hover:text-[#39FF14] transition-colors">{a.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{a.boyGroup.name}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-900">
                  <span className="text-[#39FF14] text-xs font-black">Rp{a.price.toLocaleString("id-ID")}</span>
                  <span className="text-[10px] text-gray-500">Stok: {a.stock}</span>
                </div>
              </div>
            </Link>
          ))}
          {latestAlbums.length === 0 && (
            <p className="text-gray-500 text-sm col-span-full text-center">Belum ada album dirilis.</p>
          )}
        </div>
      </section>

    </div>
  );
}