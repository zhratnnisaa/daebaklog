"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAlbum(formData: FormData) {
  const boyGroupId = formData.get("boyGroupId") as string;
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const releaseDate = formData.get("releaseDate") as string;
  const coverUrl = formData.get("coverUrl") as string;

  await prisma.album.create({
    data: {
      boyGroupId,
      title,
      price,
      stock,
      releaseDate: new Date(releaseDate),
      coverUrl: coverUrl || null,
    },
  });

  revalidatePath("/admin/albums");
  redirect("/admin/albums");
}

export async function updateAlbum(id: string, formData: FormData) {
  const boyGroupId = formData.get("boyGroupId") as string;
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const releaseDate = formData.get("releaseDate") as string;
  const coverUrl = formData.get("coverUrl") as string;

  await prisma.album.update({
    where: { id },
    data: {
      boyGroupId,
      title,
      price,
      stock,
      releaseDate: new Date(releaseDate),
      coverUrl: coverUrl || null,
    },
  });

  revalidatePath("/admin/albums");
  redirect("/admin/albums");
}

export async function deleteAlbum(id: string) {
  await prisma.album.delete({ where: { id } });
  revalidatePath("/admin/albums");
}