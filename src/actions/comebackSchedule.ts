"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createComebackSchedule(formData: FormData) {
  const boyGroupId = formData.get("boyGroupId") as string;
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;

  await prisma.comebackSchedule.create({
    data: {
      boyGroupId,
      title,
      date: new Date(date),
      type,
    },
  });

  revalidatePath("/admin/comeback-schedule");
  revalidatePath("/");
  redirect("/admin/comeback-schedule");
}

export async function updateComebackSchedule(id: string, formData: FormData) {
  const boyGroupId = formData.get("boyGroupId") as string;
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;

  await prisma.comebackSchedule.update({
    where: { id },
    data: {
      boyGroupId,
      title,
      date: new Date(date),
      type,
    },
  });

  revalidatePath("/admin/comeback-schedule");
  revalidatePath("/");
  redirect("/admin/comeback-schedule");
}

export async function deleteComebackSchedule(id: string) {
  await prisma.comebackSchedule.delete({ where: { id } });
  revalidatePath("/admin/comeback-schedule");
  revalidatePath("/");
}
