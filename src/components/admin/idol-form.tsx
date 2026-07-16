"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { createMember } from "@/actions/member";

export function IdolForm({ boyGroups }: { boyGroups: { id: string; name: string }[] }) {
  const [photoUrl, setPhotoUrl] = useState<string>("");

  return (
    <form action={createMember} className="flex flex-col gap-4">
      <select name="boyGroupId" required className="p-2 rounded bg-gray-800 text-white">
        <option value="">Pilih BoyGroup</option>
        {boyGroups.map((bg) => (
          <option key={bg.id} value={bg.id}>{bg.name}</option>
        ))}
      </select>

      <input name="stageName" placeholder="Stage Name" required className="p-2 rounded bg-gray-800 text-white" />
      <input name="realName" placeholder="Nama Asli" required className="p-2 rounded bg-gray-800 text-white" />
      <input name="birthDate" type="date" required className="p-2 rounded bg-gray-800 text-white" />
      <input name="position" placeholder="Posisi (Leader/Vocal/dll)" required className="p-2 rounded bg-gray-800 text-white" />
      <input name="favoriteFood" placeholder="Makanan Favorit" className="p-2 rounded bg-gray-800 text-white" />
      <textarea name="funFact" placeholder="Fun Fact" className="p-2 rounded bg-gray-800 text-white" />

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Foto Idol</label>
        <UploadButton
          endpoint="idolPhoto"
          onClientUploadComplete={(res) => {
            setPhotoUrl(res[0].url);
          }}
          onUploadError={(err) => {
            alert(`Upload gagal: ${err.message}`);
          }}
        />
        {photoUrl && (
          <Image src={photoUrl} alt="Preview" width={96} height={96} className="w-24 h-24 object-cover rounded" />
        )}
      </div>
      <input type="hidden" name="photoUrl" value={photoUrl} />

      <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
        Simpan
      </button>
    </form>
  );
}