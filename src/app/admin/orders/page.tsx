import { prisma } from "@/lib/prisma";
import { adminUpdateTicketOrderStatus } from "@/actions/order";
import { adminUpdateAlbumOrderStatus } from "@/actions/albumOrder";

const STATUS_OPTIONS = ["PENDING", "PAID", "FAILED", "CANCELLED"] as const;

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-600",
  PAID: "bg-green-600",
  FAILED: "bg-red-600",
  CANCELLED: "bg-gray-600",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "album" ? "album" : "ticket";

  const [ticketOrders, albumOrders] = await Promise.all([
    prisma.ticketOrder.findMany({
      include: { user: true, concert: { include: { boyGroup: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.albumOrder.findMany({
      include: { user: true, album: { include: { boyGroup: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Kelola Pesanan</h1>

      <div className="flex gap-2 mb-6">
        <a
          href="/admin/orders?tab=ticket"
          className={`px-4 py-2 rounded font-semibold ${activeTab === "ticket" ? "bg-[#39FF14] text-black" : "bg-gray-800 text-white"}`}
        >
          🎤 Tiket Konser ({ticketOrders.length})
        </a>
        <a
          href="/admin/orders?tab=album"
          className={`px-4 py-2 rounded font-semibold ${activeTab === "album" ? "bg-[#39FF14] text-black" : "bg-gray-800 text-white"}`}
        >
          💿 Album ({albumOrders.length})
        </a>
      </div>

      {activeTab === "ticket" ? (
        <div className="grid gap-3">
          {ticketOrders.map((o) => (
            <div key={o.id} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-800 p-3 rounded">
              <div className="flex-1 text-white">
                <p className="font-semibold">{o.concert.title}</p>
                <p className="text-sm text-gray-400">
                  {o.concert.boyGroup.name} · {o.user.name} ({o.user.email})
                </p>
                <p className="text-xs text-[#39FF14]">
                  {o.quantity} tiket · Rp{o.totalPrice.toLocaleString("id-ID")}
                </p>
              </div>

              <span className={`text-xs font-bold text-white px-2 py-1 rounded ${STATUS_COLOR[o.status]}`}>
                {o.status}
              </span>

              <form action={adminUpdateTicketOrderStatus.bind(null, o.id)} className="flex gap-2">
                <select name="status" defaultValue={o.status} className="p-1.5 rounded bg-gray-900 text-white text-sm">
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" className="text-sm px-3 py-1 rounded bg-blue-600 text-white">
                  Update
                </button>
              </form>
            </div>
          ))}
          {ticketOrders.length === 0 && (
            <div className="bg-gray-950/40 border border-gray-800 p-8 rounded-xl text-center text-gray-500 text-sm">
              Belum ada pesanan tiket.
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {albumOrders.map((o) => (
            <div key={o.id} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-800 p-3 rounded">
              <div className="flex-1 text-white">
                <p className="font-semibold">{o.album.title}</p>
                <p className="text-sm text-gray-400">
                  {o.album.boyGroup.name} · {o.user.name} ({o.user.email})
                </p>
                <p className="text-xs text-[#39FF14]">
                  {o.quantity} album · Rp{o.totalPrice.toLocaleString("id-ID")}
                </p>
              </div>

              <span className={`text-xs font-bold text-white px-2 py-1 rounded ${STATUS_COLOR[o.status]}`}>
                {o.status}
              </span>

              <form action={adminUpdateAlbumOrderStatus.bind(null, o.id)} className="flex gap-2">
                <select name="status" defaultValue={o.status} className="p-1.5 rounded bg-gray-900 text-white text-sm">
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" className="text-sm px-3 py-1 rounded bg-blue-600 text-white">
                  Update
                </button>
              </form>
            </div>
          ))}
          {albumOrders.length === 0 && (
            <div className="bg-gray-950/40 border border-gray-800 p-8 rounded-xl text-center text-gray-500 text-sm">
              Belum ada pesanan album.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
