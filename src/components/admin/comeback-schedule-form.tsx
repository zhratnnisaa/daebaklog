"use client";

import { createComebackSchedule, updateComebackSchedule } from "@/actions/comebackSchedule";

type ComebackSchedule = {
  id: string;
  boyGroupId: string;
  title: string;
  date: Date;
  type: string;
};

const TYPE_OPTIONS = ["Album", "Single", "MV", "Showcase", "Lainnya"];

export function ComebackScheduleForm({
  boyGroups,
  schedule,
}: {
  boyGroups: { id: string; name: string }[];
  schedule?: ComebackSchedule;
}) {
  const isEdit = !!schedule;
  const action = isEdit ? updateComebackSchedule.bind(null, schedule.id) : createComebackSchedule;

  return (
    <form action={action} className="flex flex-col gap-4">
      <select name="boyGroupId" required defaultValue={schedule?.boyGroupId ?? ""} className="p-2 rounded bg-gray-800 text-white">
        <option value="">Pilih BoyGroup</option>
        {boyGroups.map((bg) => (
          <option key={bg.id} value={bg.id}>{bg.name}</option>
        ))}
      </select>

      <input
        name="title"
        placeholder="Judul Comeback"
        required
        defaultValue={schedule?.title}
        className="p-2 rounded bg-gray-800 text-white"
      />

      <input
        name="date"
        type="datetime-local"
        required
        defaultValue={schedule ? new Date(schedule.date).toISOString().slice(0, 16) : undefined}
        className="p-2 rounded bg-gray-800 text-white"
      />

      <select name="type" required defaultValue={schedule?.type ?? ""} className="p-2 rounded bg-gray-800 text-white">
        <option value="">Pilih Tipe</option>
        {TYPE_OPTIONS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
        {isEdit ? "Update" : "Simpan"}
      </button>
    </form>
  );
}
