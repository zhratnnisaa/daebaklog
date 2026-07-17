import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createTicketOrder } from "@/actions/order";
import Image from "next/image";

export default async function ConcertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const concert = await prisma.concert.findUnique({
    where: { id },
    include: { boyGroup: true },
  });

  if (!concert) notFound();

  const buyTicket = createTicketOrder.bind(null, concert.id);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {concert.posterUrl && (
        <Image src={concert.posterUrl} alt={concert.title} width={300} height={400} className="rounded-lg mb-4" />
      )}
      <h1 className="text-3xl font-bold text-white">{concert.title}</h1>
      <p className="text-gray-400">{concert.boyGroup.name}</p>
      <p className="text-gray-300 mt-2">
        {new Date(concert.date).toLocaleString("id-ID")} · {concert.location}
      </p>
      <p className="text-[#39FF14] font-semibold mt-2">
        Rp{concert.price.toLocaleString("id-ID")} · Sisa kuota: {concert.quota}
      </p>

      <form action={buyTicket} className="mt-6 flex flex-col gap-3 max-w-xs">
        <label className="text-white text-sm">Jumlah Tiket</label>
        <input
          name="quantity"
          type="number"
          min={1}
          max={concert.quota}
          defaultValue={1}
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
          Beli Tiket
        </button>
      </form>
    </div>
  );
}