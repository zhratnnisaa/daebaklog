import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { deleteFandomPhoto } from "@/actions/fandomPhoto";

export default async function FandomGalleryPage() {
  const photos = await prisma.fandomPhoto.findMany({
    include: { boyGroup: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Fandom Gallery</h1>
        <Link href="/admin/fandom-gallery/new" className="bg-[#39FF14] text-black px-4 py-2 rounded font-semibold">
          + Tambah Foto
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <div key={p.id} className="flex flex-col gap-3 bg-gray-800 p-3 rounded">
            <Image
              src={p.imageUrl}
              alt={p.caption || "Fandom Photo"}
              width={400}
              height={300}
              className="w-full h-40 object-cover rounded"
            />
            <div className="text-white">
              <p className="text-sm font-semibold text-[#39FF14]">{p.boyGroup.name}</p>
              <p className="text-sm text-gray-400 italic line-clamp-2">{p.caption || "Tanpa caption"}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/fandom-gallery/${p.id}/edit`} className="flex-1 text-center text-sm px-3 py-1 rounded bg-blue-600 text-white">
                Edit
              </Link>
              <form action={deleteFandomPhoto.bind(null, p.id)} className="flex-1">
                <button type="submit" className="w-full text-sm px-3 py-1 rounded bg-red-600 text-white">
                  Hapus
                </button>
              </form>
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full bg-gray-950/40 border border-gray-800 p-8 rounded-xl text-center text-gray-500 text-sm">
            Belum ada foto fandom. Tambahkan yang pertama!
          </div>
        )}
      </div>
    </div>
  );
}
