"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createConcert(formData: FormData) {
  const boyGroupId = formData.get("boyGroupId") as string;
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const price = Number(formData.get("price"));
  const quota = Number(formData.get("quota"));
  const posterUrl = formData.get("posterUrl") as string;

  await prisma.concert.create({
    data: {
      boyGroupId,
      title,
      date: new Date(date),
      location,
      price,
      quota,
      posterUrl: posterUrl || null,
    },
  });

  revalidatePath("/admin/concerts");
  redirect("/admin/concerts");
}

export async function updateConcert(id: string, formData: FormData) {
  const boyGroupId = formData.get("boyGroupId") as string;
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const price = Number(formData.get("price"));
  const quota = Number(formData.get("quota"));
  const posterUrl = formData.get("posterUrl") as string;

  await prisma.concert.update({
    where: { id },
    data: {
      boyGroupId,
      title,
      date: new Date(date),
      location,
      price,
      quota,
      posterUrl: posterUrl || null,
    },
  });

  revalidatePath("/admin/concerts");
  redirect("/admin/concerts");
}

export async function deleteConcert(id: string) {
  await prisma.concert.delete({ where: { id } });
  revalidatePath("/admin/concerts");
}