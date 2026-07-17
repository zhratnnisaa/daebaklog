import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteConcert } from "@/actions/concert";

export default async function ConcertsPage() {
  const concerts = await prisma.concert.findMany({
    include: { boyGroup: true },
    orderBy: { date: "asc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Daftar Konser</h1>
        <Link href="/admin/concerts/new" className="bg-[#39FF14] text-black px-4 py-2 rounded font-semibold">
          + Tambah Konser
        </Link>
      </div>

      <div className="grid gap-3">
        {concerts.map((c) => (
          <div key={c.id} className="flex items-center gap-4 bg-gray-800 p-3 rounded">
            <div className="flex-1 text-white">
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-gray-400">
                {c.boyGroup.name} · {new Date(c.date).toLocaleString("id-ID")} · {c.location}
              </p>
              <p className="text-xs text-[#39FF14]">Rp{c.price.toLocaleString("id-ID")} · Kuota {c.quota}</p>
            </div>

            <Link href={`/admin/concerts/${c.id}/edit`} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">
              Edit
            </Link>

            <form action={deleteConcert.bind(null, c.id)}>
              <button type="submit" className="text-sm px-3 py-1 rounded bg-red-600 text-white">
                Hapus
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}