import { prisma } from "@/lib/prisma";
import { createMember } from "@/actions/member";

export default async function NewIdolPage() {
  const boyGroups = await prisma.boyGroup.findMany();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Tambah Idol</h1>

      <form action={createMember} className="flex flex-col gap-4">
        <select name="boyGroupId" required className="p-2 rounded bg-gray-800 text-white">
          <option value="">Pilih BoyGroup</option>
          {boyGroups.map((bg) => (
            <option key={bg.id} value={bg.id}>{bg.name}</option>
          ))}
        </select>

        <input name="stageName" placeholder="Stage Name" required className="p-2 rounded bg-gray-800 text-white" />
        <input name="realName" placeholder="Nama Asli" required className="p-2 rounded bg-gray-800 text-white" />
        <input name="birthDate" type="date" required className="p-2 rounded bg-gray-800 text-white" />
        <input name="position" placeholder="Posisi (Leader/Vocal/dll)" required className="p-2 rounded bg-gray-800 text-white" />
        <input name="favoriteFood" placeholder="Makanan Favorit" className="p-2 rounded bg-gray-800 text-white" />
        <textarea name="funFact" placeholder="Fun Fact" className="p-2 rounded bg-gray-800 text-white" />

        <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
          Simpan
        </button>
      </form>
    </div>
  );
}