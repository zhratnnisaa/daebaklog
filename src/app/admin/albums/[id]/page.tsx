import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createSong, deleteSong } from "@/actions/song";

export default async function AlbumSongsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const album = await prisma.album.findUnique({
    where: { id },
    include: { songs: true, boyGroup: true },
  });

  if (!album) notFound();

  const createSongWithId = createSong.bind(null, id);

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-1">{album.title}</h1>
      <p className="text-gray-400 mb-6">{album.boyGroup.name}</p>

      <h2 className="text-lg font-semibold text-white mb-2">Daftar Lagu</h2>
      <div className="flex flex-col gap-2 mb-6">
        {album.songs.map((s) => (
          <div key={s.id} className="flex items-center gap-3 bg-gray-800 p-2 rounded">
            <span className="flex-1 text-white">{s.title}</span>
            <span className="text-sm text-gray-400">{Math.floor(s.duration / 60)}:{String(s.duration % 60).padStart(2, "0")}</span>
            <form action={deleteSong.bind(null, s.id, id)}>
              <button type="submit" className="text-sm px-2 py-1 rounded bg-red-600 text-white">Hapus</button>
            </form>
          </div>
        ))}
        {album.songs.length === 0 && <p className="text-gray-500 text-sm">Belum ada lagu.</p>}
      </div>

      <h2 className="text-lg font-semibold text-white mb-2">Tambah Lagu</h2>
      <form action={createSongWithId} className="flex flex-col gap-3">
        <input name="title" placeholder="Judul Lagu" required className="p-2 rounded bg-gray-800 text-white" />
        <input name="duration" type="number" placeholder="Durasi (detik)" required className="p-2 rounded bg-gray-800 text-white" />
        <input name="previewUrl" placeholder="URL Preview (opsional)" className="p-2 rounded bg-gray-800 text-white" />
        <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
          Tambah Lagu
        </button>
      </form>
    </div>
  );
}