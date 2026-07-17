import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [
    boyGroupCount,
    memberCount,
    concertCount,
    albumCount,
    fandomPhotoCount,
    comebackScheduleCount,
    pendingTicketOrders,
    pendingAlbumOrders,
    userCount,
  ] = await Promise.all([
    prisma.boyGroup.count(),
    prisma.member.count(),
    prisma.concert.count(),
    prisma.album.count(),
    prisma.fandomPhoto.count(),
    prisma.comebackSchedule.count(),
    prisma.ticketOrder.count({ where: { status: "PENDING" } }),
    prisma.albumOrder.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
  ]);

  const cards = [
    { label: "BoyGroup", value: boyGroupCount, href: "/admin/boygroups", icon: "👥" },
    { label: "Idol", value: memberCount, href: "/admin/idols", icon: "🎤" },
    { label: "Konser", value: concertCount, href: "/admin/concerts", icon: "🎫" },
    { label: "Album", value: albumCount, href: "/admin/albums", icon: "💿" },
    { label: "Foto Fandom", value: fandomPhotoCount, href: "/admin/fandom-gallery", icon: "✨" },
    { label: "Jadwal Comeback", value: comebackScheduleCount, href: "/admin/comeback-schedule", icon: "📅" },
    { label: "Total User", value: userCount, href: "#", icon: "🙋" },
  ];

  const pendingTotal = pendingTicketOrders + pendingAlbumOrders;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-6">Ringkasan konten & aktivitas Daebaklog.</p>

      {pendingTotal > 0 && (
        <Link
          href="/admin/orders"
          className="block mb-6 p-4 rounded-xl bg-yellow-950/40 border border-yellow-700/50 hover:border-yellow-500 transition-colors"
        >
          <p className="text-yellow-400 font-semibold text-sm">
            ⚠️ Ada {pendingTotal} pesanan berstatus PENDING yang perlu ditinjau ({pendingTicketOrders} tiket, {pendingAlbumOrders} album).
          </p>
        </Link>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-gray-950 border border-gray-900 hover:border-[#39FF14]/50 rounded-xl p-4 transition-colors"
          >
            <div className="text-2xl mb-2">{c.icon}</div>
            <p className="text-3xl font-black text-white">{c.value}</p>
            <p className="text-gray-400 text-sm">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
