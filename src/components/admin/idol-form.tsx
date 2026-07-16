"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { createMember, updateMember } from "@/actions/member";

type Member = {
  id: string;
  boyGroupId: string;
  stageName: string;
  realName: string;
  birthDate: Date;
  position: string;
  favoriteFood: string | null;
  funFact: string | null;
  photoUrl: string | null;
};

export function IdolForm({
  boyGroups,
  member,
}: {
  boyGroups: { id: string; name: string }[];
  member?: Member;
}) {
  const [photoUrl, setPhotoUrl] = useState<string>(member?.photoUrl ?? "");
  const isEdit = !!member;
  const action = isEdit ? updateMember.bind(null, member.id) : createMember;

  return (
    <form action={action} className="flex flex-col gap-4">
      <select name="boyGroupId" required defaultValue={member?.boyGroupId ?? ""} className="p-2 rounded bg-gray-800 text-white">
        <option value="">Pilih BoyGroup</option>
        {boyGroups.map((bg) => (
          <option key={bg.id} value={bg.id}>{bg.name}</option>
        ))}
      </select>

      <input name="stageName" placeholder="Stage Name" required defaultValue={member?.stageName} className="p-2 rounded bg-gray-800 text-white" />
      <input name="realName" placeholder="Nama Asli" required defaultValue={member?.realName} className="p-2 rounded bg-gray-800 text-white" />
      <input
        name="birthDate"
        type="date"
        required
        defaultValue={member ? new Date(member.birthDate).toISOString().split("T")[0] : undefined}
        className="p-2 rounded bg-gray-800 text-white"
      />
      <input name="position" placeholder="Posisi (Leader/Vocal/dll)" required defaultValue={member?.position} className="p-2 rounded bg-gray-800 text-white" />
      <input name="favoriteFood" placeholder="Makanan Favorit" defaultValue={member?.favoriteFood ?? ""} className="p-2 rounded bg-gray-800 text-white" />
      <textarea name="funFact" placeholder="Fun Fact" defaultValue={member?.funFact ?? ""} className="p-2 rounded bg-gray-800 text-white" />

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Foto Idol</label>
        <UploadButton
          endpoint="idolPhoto"
          onClientUploadComplete={(res) => setPhotoUrl(res[0].url)}
          onUploadError={(err) => alert(`Upload gagal: ${err.message}`)}
        />
        {photoUrl && (
          <Image src={photoUrl} alt="Preview" width={96} height={96} className="w-24 h-24 object-cover rounded" />
        )}
      </div>
      <input type="hidden" name="photoUrl" value={photoUrl} />

      <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
        {isEdit ? "Update" : "Simpan"}
      </button>
    </form>
  );
}