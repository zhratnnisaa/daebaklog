import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteAlbum } from "@/actions/album";

export default async function AlbumsPage() {
  const albums = await prisma.album.findMany({
    include: { boyGroup: true, _count: { select: { songs: true } } },
    orderBy: { releaseDate: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Daftar Album</h1>
        <Link href="/admin/albums/new" className="bg-[#39FF14] text-black px-4 py-2 rounded font-semibold">
          + Tambah Album
        </Link>
      </div>

      <div className="grid gap-3">
        {albums.map((a) => (
          <div key={a.id} className="flex items-center gap-4 bg-gray-800 p-3 rounded">
            <div className="flex-1 text-white">
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm text-gray-400">{a.boyGroup.name} · {a._count.songs} lagu</p>
              <p className="text-xs text-[#39FF14]">Rp{a.price.toLocaleString("id-ID")} · Stok {a.stock}</p>
            </div>

            <Link href={`/admin/albums/${a.id}`} className="text-sm px-3 py-1 rounded bg-purple-600 text-white">
              Kelola Lagu
            </Link>
            <Link href={`/admin/albums/${a.id}/edit`} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">
              Edit
            </Link>
            <form action={deleteAlbum.bind(null, a.id)}>
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