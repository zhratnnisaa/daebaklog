import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createAlbumOrder } from "@/actions/albumOrder";
import Image from "next/image";

export default async function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const album = await prisma.album.findUnique({
    where: { id },
    include: { boyGroup: true, songs: true },
  });

  if (!album) notFound();

  const buyAlbum = createAlbumOrder.bind(null, album.id);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex gap-6 mb-6">
        {album.coverUrl ? (
          <Image src={album.coverUrl} alt={album.title} width={200} height={200} className="rounded-lg object-cover" />
        ) : (
          <div className="w-48 h-48 bg-gray-800 rounded-lg" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-white">{album.title}</h1>
          <p className="text-gray-400">{album.boyGroup.name}</p>
          <p className="text-gray-500 text-sm mt-1">
            Rilis {new Date(album.releaseDate).toLocaleDateString("id-ID")}
          </p>
          <p className="text-[#39FF14] font-semibold mt-2">
            Rp{album.price.toLocaleString("id-ID")} · Stok: {album.stock}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-white mb-2">Daftar Lagu</h2>
      <div className="flex flex-col gap-1 mb-6">
        {album.songs.map((s) => (
          <div key={s.id} className="flex justify-between text-gray-300 text-sm bg-gray-900 px-3 py-2 rounded">
            <span>{s.title}</span>
            <span className="text-gray-500">{Math.floor(s.duration / 60)}:{String(s.duration % 60).padStart(2, "0")}</span>
          </div>
        ))}
      </div>

      <form action={buyAlbum} className="flex flex-col gap-3 max-w-xs">
        <label className="text-white text-sm">Jumlah</label>
        <input
          name="quantity"
          type="number"
          min={1}
          max={album.stock}
          defaultValue={1}
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
          Beli Album
        </button>
      </form>
    </div>
  );
}