import { prisma } from "@/lib/prisma";
import { AlbumForm } from "@/components/admin/album-form";

export default async function NewAlbumPage() {
  const boyGroups = await prisma.boyGroup.findMany();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Tambah Album</h1>
      <AlbumForm boyGroups={boyGroups} />
    </div>
  );
}