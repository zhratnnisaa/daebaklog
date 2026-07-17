import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteComebackSchedule } from "@/actions/comebackSchedule";

export default async function ComebackSchedulePage() {
  const schedules = await prisma.comebackSchedule.findMany({
    include: { boyGroup: true },
    orderBy: { date: "asc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Jadwal Comeback</h1>
        <Link href="/admin/comeback-schedule/new" className="bg-[#39FF14] text-black px-4 py-2 rounded font-semibold">
          + Tambah Jadwal
        </Link>
      </div>

      <div className="grid gap-3">
        {schedules.map((s) => (
          <div key={s.id} className="flex items-center gap-4 bg-gray-800 p-3 rounded">
            <div className="flex-1 text-white">
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-gray-400">
                {s.boyGroup.name} · {s.type}
              </p>
              <p className="text-xs text-[#39FF14]">
                {new Date(s.date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>

            <Link href={`/admin/comeback-schedule/${s.id}/edit`} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">
              Edit
            </Link>

            <form action={deleteComebackSchedule.bind(null, s.id)}>
              <button type="submit" className="text-sm px-3 py-1 rounded bg-red-600 text-white">
                Hapus
              </button>
            </form>
          </div>
        ))}
        {schedules.length === 0 && (
          <div className="bg-gray-950/40 border border-gray-800 p-8 rounded-xl text-center text-gray-500 text-sm">
            Belum ada jadwal comeback. Tambahkan yang pertama!
          </div>
        )}
      </div>
    </div>
  );
}
