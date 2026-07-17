"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { createAlbum, updateAlbum } from "@/actions/album";

type Album = {
  id: string;
  boyGroupId: string;
  title: string;
  price: number;
  stock: number;
  releaseDate: Date;
  coverUrl: string | null;
};

export function AlbumForm({
  boyGroups,
  album,
}: {
  boyGroups: { id: string; name: string }[];
  album?: Album;
}) {
  const [coverUrl, setCoverUrl] = useState<string>(album?.coverUrl ?? "");
  const isEdit = !!album;
  const action = isEdit ? updateAlbum.bind(null, album.id) : createAlbum;

  return (
    <form action={action} className="flex flex-col gap-4">
      <select name="boyGroupId" required defaultValue={album?.boyGroupId ?? ""} className="p-2 rounded bg-gray-800 text-white">
        <option value="">Pilih BoyGroup</option>
        {boyGroups.map((bg) => (
          <option key={bg.id} value={bg.id}>{bg.name}</option>
        ))}
      </select>

      <input name="title" placeholder="Judul Album" required defaultValue={album?.title} className="p-2 rounded bg-gray-800 text-white" />
      <input
        name="releaseDate"
        type="date"
        required
        defaultValue={album ? new Date(album.releaseDate).toISOString().split("T")[0] : undefined}
        className="p-2 rounded bg-gray-800 text-white"
      />
      <input name="price" type="number" placeholder="Harga" required defaultValue={album?.price} className="p-2 rounded bg-gray-800 text-white" />
      <input name="stock" type="number" placeholder="Stok" required defaultValue={album?.stock} className="p-2 rounded bg-gray-800 text-white" />

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Cover Album</label>
     <UploadButton
      endpoint="albumCover"
  onClientUploadComplete={(res) => {
    if (res?.[0]?.ufsUrl) setCoverUrl(res[0].ufsUrl);
  }}
  onUploadError={(err) => alert(`Upload gagal: ${err.message}`)}
/>
        
        {coverUrl && (
          <Image src={coverUrl} alt="Preview" width={150} height={150} className="w-32 h-32 object-cover rounded" />
        )}
      </div>
      <input type="hidden" name="coverUrl" value={coverUrl} />

      <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
        {isEdit ? "Update" : "Simpan"}
      </button>
    </form>
  );
}