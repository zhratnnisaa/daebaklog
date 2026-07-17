import { prisma } from "@/lib/prisma";
import { FandomPhotoForm } from "@/components/admin/fandom-photo-form";

export default async function NewFandomPhotoPage() {
  const boyGroups = await prisma.boyGroup.findMany();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Tambah Foto Fandom</h1>
      <FandomPhotoForm boyGroups={boyGroups} />
    </div>
  );
}
