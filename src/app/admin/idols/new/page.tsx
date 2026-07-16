import { prisma } from "@/lib/prisma";
import { IdolForm } from "@/components/admin/idol-form";

export default async function NewIdolPage() {
  const boyGroups = await prisma.boyGroup.findMany();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Tambah Idol</h1>
      <IdolForm boyGroups={boyGroups} />
    </div>
  );
}