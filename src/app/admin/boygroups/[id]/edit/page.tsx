import { prisma } from "@/lib/prisma";
import { BoyGroupForm } from "@/components/admin/boygroup-form";
import { notFound } from "next/navigation";

export default async function EditBoyGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const boyGroup = await prisma.boyGroup.findUnique({ where: { id } });

  if (!boyGroup) notFound();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Edit BoyGroup</h1>
      <BoyGroupForm boyGroup={boyGroup} />
    </div>
  );
}
