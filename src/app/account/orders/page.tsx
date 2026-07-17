import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrderHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id as string;

  const [ticketOrders, albumOrders] = await Promise.all([
    prisma.ticketOrder.findMany({
      where: { userId },
      include: { concert: { include: { boyGroup: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.albumOrder.findMany({
      where: { userId },
      include: { album: { include: { boyGroup: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const statusColor: Record<string, string> = {
    PENDING: "text-yellow-400",
    PAID: "text-[#39FF14]",
    FAILED: "text-red-500",
    CANCELLED: "text-gray-500",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Riwayat Pesanan</h1>

      <h2 className="text-lg font-semibold text-white mb-3">Tiket Konser</h2>
      <div className="flex flex-col gap-2 mb-8">
        {ticketOrders.map((o) => (
          <Link
            key={o.id}
            href={`/checkout/ticket/${o.id}`}
            className="flex justify-between items-center bg-gray-900 p-3 rounded hover:bg-gray-800"
          >
            <div>
              <p className="text-white font-medium">{o.concert.title}</p>
              <p className="text-gray-500 text-sm">{o.concert.boyGroup.name} · {o.quantity} tiket</p>
            </div>
            <div className="text-right">
              <p className="text-white text-sm">Rp{o.totalPrice.toLocaleString("id-ID")}</p>
              <p className={`text-xs font-semibold ${statusColor[o.status]}`}>{o.status}</p>
            </div>
          </Link>
        ))}
        {ticketOrders.length === 0 && <p className="text-gray-500 text-sm">Belum ada pesanan tiket.</p>}
      </div>

      <h2 className="text-lg font-semibold text-white mb-3">Album</h2>
      <div className="flex flex-col gap-2">
        {albumOrders.map((o) => (
          <Link
            key={o.id}
            href={`/checkout/album/${o.id}`}
            className="flex justify-between items-center bg-gray-900 p-3 rounded hover:bg-gray-800"
          >
            <div>
              <p className="text-white font-medium">{o.album.title}</p>
              <p className="text-gray-500 text-sm">{o.album.boyGroup.name} · {o.quantity}x</p>
            </div>
            <div className="text-right">
              <p className="text-white text-sm">Rp{o.totalPrice.toLocaleString("id-ID")}</p>
              <p className={`text-xs font-semibold ${statusColor[o.status]}`}>{o.status}</p>
            </div>
          </Link>
        ))}
        {albumOrders.length === 0 && <p className="text-gray-500 text-sm">Belum ada pesanan album.</p>}
      </div>
    </div>
  );
}