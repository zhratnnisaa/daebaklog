import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FandomPhotoForm } from "@/components/admin/fandom-photo-form";

export default async function EditFandomPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [photo, boyGroups] = await Promise.all([
    prisma.fandomPhoto.findUnique({ where: { id } }),
    prisma.boyGroup.findMany(),
  ]);

  if (!photo) notFound();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Edit Foto Fandom</h1>
      <FandomPhotoForm boyGroups={boyGroups} photo={photo} />
    </div>
  );
}
