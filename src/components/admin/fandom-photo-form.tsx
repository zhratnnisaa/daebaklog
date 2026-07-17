"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { createFandomPhoto, updateFandomPhoto } from "@/actions/fandomPhoto";

type FandomPhoto = {
  id: string;
  boyGroupId: string;
  imageUrl: string;
  caption: string | null;
};

export function FandomPhotoForm({
  boyGroups,
  photo,
}: {
  boyGroups: { id: string; name: string }[];
  photo?: FandomPhoto;
}) {
  const [imageUrl, setImageUrl] = useState<string>(photo?.imageUrl ?? "");
  const isEdit = !!photo;
  const action = isEdit ? updateFandomPhoto.bind(null, photo.id) : createFandomPhoto;

  return (
    <form action={action} className="flex flex-col gap-4">
      <select name="boyGroupId" required defaultValue={photo?.boyGroupId ?? ""} className="p-2 rounded bg-gray-800 text-white">
        <option value="">Pilih BoyGroup</option>
        {boyGroups.map((bg) => (
          <option key={bg.id} value={bg.id}>{bg.name}</option>
        ))}
      </select>

      <textarea
        name="caption"
        placeholder="Caption (opsional)"
        defaultValue={photo?.caption ?? ""}
        className="p-2 rounded bg-gray-800 text-white"
      />

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Foto Fandom</label>
        <UploadButton
          endpoint="fandomPhoto"
          onClientUploadComplete={(res) => {
            if (res?.[0]?.ufsUrl) setImageUrl(res[0].ufsUrl);
          }}
          onUploadError={(err) => alert(`Upload gagal: ${err.message}`)}
        />
        {imageUrl && (
          <Image src={imageUrl} alt="Preview" width={200} height={200} className="w-40 h-40 object-cover rounded" />
        )}
      </div>
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
        {isEdit ? "Update" : "Simpan"}
      </button>
    </form>
  );
}
