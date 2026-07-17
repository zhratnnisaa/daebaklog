"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFandomPhoto(formData: FormData) {
  const boyGroupId = formData.get("boyGroupId") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const caption = formData.get("caption") as string;

  await prisma.fandomPhoto.create({
    data: {
      boyGroupId,
      imageUrl,
      caption: caption || null,
    },
  });

  revalidatePath("/admin/fandom-gallery");
  revalidatePath("/");
  redirect("/admin/fandom-gallery");
}

export async function updateFandomPhoto(id: string, formData: FormData) {
  const boyGroupId = formData.get("boyGroupId") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const caption = formData.get("caption") as string;

  await prisma.fandomPhoto.update({
    where: { id },
    data: {
      boyGroupId,
      imageUrl,
      caption: caption || null,
    },
  });

  revalidatePath("/admin/fandom-gallery");
  revalidatePath("/");
  redirect("/admin/fandom-gallery");
}

export async function deleteFandomPhoto(id: string) {
  await prisma.fandomPhoto.delete({ where: { id } });
  revalidatePath("/admin/fandom-gallery");
  revalidatePath("/");
}
