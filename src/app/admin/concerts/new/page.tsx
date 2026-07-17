import { prisma } from "@/lib/prisma";
import { ConcertForm } from "@/components/admin/concert-form";

export default async function NewConcertPage() {
  const boyGroups = await prisma.boyGroup.findMany();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Tambah Konser</h1>
      <ConcertForm boyGroups={boyGroups} />
    </div>
  );
}