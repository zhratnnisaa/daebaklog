"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSong(albumId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const duration = Number(formData.get("duration"));
  const previewUrl = formData.get("previewUrl") as string;

  await prisma.song.create({
    data: {
      albumId,
      title,
      duration,
      previewUrl: previewUrl || null,
    },
  });

  revalidatePath(`/admin/albums/${albumId}`);
}

export async function deleteSong(id: string, albumId: string) {
  await prisma.song.delete({ where: { id } });
  revalidatePath(`/admin/albums/${albumId}`);
}