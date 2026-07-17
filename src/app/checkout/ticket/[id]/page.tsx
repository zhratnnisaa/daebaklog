import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { simulatePayment } from "@/actions/order";

export default async function TicketCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.ticketOrder.findUnique({
    where: { id },
    include: { concert: { include: { boyGroup: true } } },
  });

  if (!order) notFound();

  const markPaid = simulatePayment.bind(null, order.id, "PAID");
  const markFailed = simulatePayment.bind(null, order.id, "FAILED");

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Checkout Tiket</h1>

      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <p className="text-white font-semibold">{order.concert.title}</p>
        <p className="text-gray-400 text-sm">{order.concert.boyGroup.name}</p>
        <p className="text-gray-300 mt-2">Jumlah: {order.quantity} tiket</p>
        <p className="text-[#39FF14] font-semibold">Total: Rp{order.totalPrice.toLocaleString("id-ID")}</p>
        <p className="text-sm mt-2">
          Status: <span className="font-semibold">{order.status}</span>
        </p>
      </div>

      {order.status === "PENDING" && (
        <div className="flex flex-col gap-3">
          <p className="text-gray-400 text-sm">
            (Simulasi pembayaran — tidak ada transaksi uang beneran, ini cuma untuk demo alur checkout)
          </p>
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

      {order.status === "PAID" && (
        <p className="text-[#39FF14] font-semibold">✅ Pembayaran berhasil! Tiket kamu sudah dikonfirmasi.</p>
      )}

      {order.status === "FAILED" && (
        <p className="text-red-500 font-semibold">❌ Pembayaran gagal. Silakan coba lagi.</p>
      )}
    </div>
  );
}