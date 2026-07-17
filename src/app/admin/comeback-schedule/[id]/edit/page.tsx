import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ComebackScheduleForm } from "@/components/admin/comeback-schedule-form";

export default async function EditComebackSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [schedule, boyGroups] = await Promise.all([
    prisma.comebackSchedule.findUnique({ where: { id } }),
    prisma.boyGroup.findMany(),
  ]);

  if (!schedule) notFound();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Edit Jadwal Comeback</h1>
      <ComebackScheduleForm boyGroups={boyGroups} schedule={schedule} />
    </div>
  );
}
