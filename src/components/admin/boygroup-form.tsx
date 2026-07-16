"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { createBoyGroup, updateBoyGroup } from "@/actions/boygroup";

type BoyGroup = {
  id: string;
  name: string;
  agency: string;
  debutYear: number;
  description: string | null;
  logoUrl: string | null;
};

export function BoyGroupForm({ boyGroup }: { boyGroup?: BoyGroup }) {
  const [logoUrl, setLogoUrl] = useState<string>(boyGroup?.logoUrl ?? "");
  const isEdit = !!boyGroup;
  const action = isEdit ? updateBoyGroup.bind(null, boyGroup.id) : createBoyGroup;

  return (
    <form action={action} className="flex flex-col gap-4">
      <input name="name" placeholder="Nama Grup" required defaultValue={boyGroup?.name} className="p-2 rounded bg-gray-800 text-white" />
      <input name="agency" placeholder="Agency" required defaultValue={boyGroup?.agency} className="p-2 rounded bg-gray-800 text-white" />
      <input name="debutYear" type="number" placeholder="Tahun Debut" required defaultValue={boyGroup?.debutYear} className="p-2 rounded bg-gray-800 text-white" />
      <textarea name="description" placeholder="Deskripsi" defaultValue={boyGroup?.description ?? ""} className="p-2 rounded bg-gray-800 text-white" />

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Logo</label>
        <UploadButton
          endpoint="boyGroupLogo"
          onClientUploadComplete={(res) => setLogoUrl(res[0].url)}
          onUploadError={(err) => alert(`Upload gagal: ${err.message}`)}
        />
        {logoUrl && (
          <Image src={logoUrl} alt="Preview" width={96} height={96} className="w-24 h-24 object-cover rounded" />
        )}
      </div>
      <input type="hidden" name="logoUrl" value={logoUrl} />

      <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
        {isEdit ? "Update" : "Simpan"}
      </button>
    </form>
  );
}