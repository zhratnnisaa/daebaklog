import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { simulateAlbumPayment } from "@/actions/albumOrder";

export default async function AlbumCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.albumOrder.findUnique({
    where: { id },
    include: { album: { include: { boyGroup: true } } },
  });

  if (!order) notFound();

  const markPaid = simulateAlbumPayment.bind(null, order.id, "PAID");
  const markFailed = simulateAlbumPayment.bind(null, order.id, "FAILED");

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Checkout Album</h1>

      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <p className="text-white font-semibold">{order.album.title}</p>
        <p className="text-gray-400 text-sm">{order.album.boyGroup.name}</p>
        <p className="text-gray-300 mt-2">Jumlah: {order.quantity}</p>
        <p className="text-[#39FF14] font-semibold">Total: Rp{order.totalPrice.toLocaleString("id-ID")}</p>
        <p className="text-sm mt-2">Status: <span className="font-semibold">{order.status}</span></p>
      </div>

      {order.status === "PENDING" && (
        <div className="flex flex-col gap-3">
          <p className="text-gray-400 text-sm">(Simulasi pembayaran — demo alur checkout)</p>
          <form action={markPaid}>
            <button type="submit" className="w-full py-2 rounded bg-[#39FF14] text-black font-semibold">
              Simulasikan Bayar Berhasil
            </button>
          </form>
          <form action={markFailed}>
            <button type="submit" className="w-full py-2 rounded bg-red-600 text-white font-semibold">
              Simulasikan Bayar Gagal
            </button>
          </form>
        </div>
      )}

      {order.status === "PAID" && <p className="text-[#39FF14] font-semibold">✅ Pembayaran berhasil!</p>}
      {order.status === "FAILED" && <p className="text-red-500 font-semibold">❌ Pembayaran gagal.</p>}
    </div>
  );
}