import { prisma } from "@/lib/prisma";
import { IdolForm } from "@/components/admin/idol-form";
import { notFound } from "next/navigation";

export default async function EditIdolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [member, boyGroups] = await Promise.all([
    prisma.member.findUnique({ where: { id } }),
    prisma.boyGroup.findMany(),
  ]);

  if (!member) notFound();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Edit Idol</h1>
      <IdolForm boyGroups={boyGroups} member={member} />
    </div>
  );
}