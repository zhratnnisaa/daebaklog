"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { createConcert, updateConcert } from "@/actions/concert";

type Concert = {
  id: string;
  boyGroupId: string;
  title: string;
  date: Date;
  location: string;
  price: number;
  quota: number;
  posterUrl: string | null;
};

export function ConcertForm({
  boyGroups,
  concert,
}: {
  boyGroups: { id: string; name: string }[];
  concert?: Concert;
}) {
  const [posterUrl, setPosterUrl] = useState<string>(concert?.posterUrl ?? "");
  const isEdit = !!concert;
  const action = isEdit ? updateConcert.bind(null, concert.id) : createConcert;

  return (
    <form action={action} className="flex flex-col gap-4">
      <select name="boyGroupId" required defaultValue={concert?.boyGroupId ?? ""} className="p-2 rounded bg-gray-800 text-white">
        <option value="">Pilih BoyGroup</option>
        {boyGroups.map((bg) => (
          <option key={bg.id} value={bg.id}>{bg.name}</option>
        ))}
      </select>

      <input name="title" placeholder="Judul Konser" required defaultValue={concert?.title} className="p-2 rounded bg-gray-800 text-white" />
      <input
        name="date"
        type="datetime-local"
        required
        defaultValue={concert ? new Date(concert.date).toISOString().slice(0, 16) : undefined}
        className="p-2 rounded bg-gray-800 text-white"
      />
      <input name="location" placeholder="Lokasi" required defaultValue={concert?.location} className="p-2 rounded bg-gray-800 text-white" />
      <input name="price" type="number" placeholder="Harga Tiket" required defaultValue={concert?.price} className="p-2 rounded bg-gray-800 text-white" />
      <input name="quota" type="number" placeholder="Kuota Tiket" required defaultValue={concert?.quota} className="p-2 rounded bg-gray-800 text-white" />

      <div className="flex flex-col gap-2">
        <label className="text-white text-sm">Poster</label>
        <UploadButton
          endpoint="concertPoster"
          onClientUploadComplete={(res) => setPosterUrl(res[0].url)}
          onUploadError={(err) => alert(`Upload gagal: ${err.message}`)}
        />
        {posterUrl && (
          <Image src={posterUrl} alt="Preview" width={150} height={200} className="w-32 object-cover rounded" />
        )}
      </div>
      <input type="hidden" name="posterUrl" value={posterUrl} />

      <button type="submit" className="py-2 rounded bg-[#39FF14] text-black font-semibold shadow-[0_0_10px_#39FF14]">
        {isEdit ? "Update" : "Simpan"}
      </button>
    </form>
  );
}
