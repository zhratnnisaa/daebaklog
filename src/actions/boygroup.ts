"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBoyGroup(formData: FormData) {
  const name = formData.get("name") as string;
  const agency = formData.get("agency") as string;
  const debutYear = Number(formData.get("debutYear"));
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;

  await prisma.boyGroup.create({
    data: {
      name,
      agency,
      debutYear,
      description: description || null,
      logoUrl: logoUrl || null,
    },
  });

  revalidatePath("/admin/boygroups");
  redirect("/admin/boygroups");
}

export async function updateBoyGroup(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const agency = formData.get("agency") as string;
  const debutYear = Number(formData.get("debutYear"));
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;

  await prisma.boyGroup.update({
    where: { id },
    data: {
      name,
      agency,
      debutYear,
      description: description || null,
      logoUrl: logoUrl || null,
    },
  });

  revalidatePath("/admin/boygroups");
  redirect("/admin/boygroups");
}

export async function deleteBoyGroup(id: string) {
  await prisma.boyGroup.delete({ where: { id } });
  revalidatePath("/admin/boygroups");
}