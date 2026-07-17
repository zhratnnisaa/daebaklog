import { prisma } from "@/lib/prisma";
import { ConcertForm } from "@/components/admin/concert-form";
import { notFound } from "next/navigation";

export default async function EditConcertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [concert, boyGroups] = await Promise.all([
    prisma.concert.findUnique({ where: { id } }),
    prisma.boyGroup.findMany(),
  ]);

  if (!concert) notFound();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Edit Konser</h1>
      <ConcertForm boyGroups={boyGroups} concert={concert} />
    </div>
  );
}