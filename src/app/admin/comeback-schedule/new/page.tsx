import { prisma } from "@/lib/prisma";
import { ComebackScheduleForm } from "@/components/admin/comeback-schedule-form";

export default async function NewComebackSchedulePage() {
  const boyGroups = await prisma.boyGroup.findMany();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Tambah Jadwal Comeback</h1>
      <ComebackScheduleForm boyGroups={boyGroups} />
    </div>
  );
}
