"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMember(formData: FormData) {
  const stageName = formData.get("stageName") as string;
  const realName = formData.get("realName") as string;
  const birthDate = formData.get("birthDate") as string;
  const position = formData.get("position") as string;
  const favoriteFood = formData.get("favoriteFood") as string;
  const funFact = formData.get("funFact") as string;
  const boyGroupId = formData.get("boyGroupId") as string;
  const photoUrl = formData.get("photoUrl") as string;

  await prisma.member.create({
    data: {
      stageName,
      realName,
      birthDate: new Date(birthDate),
      position,
      favoriteFood,
      funFact,
      boyGroupId,
      photoUrl: photoUrl || null,
    },
  });

  revalidatePath("/admin/idols");
  redirect("/admin/idols");
}

export async function updateMember(id: string, formData: FormData) {
  const stageName = formData.get("stageName") as string;
  const realName = formData.get("realName") as string;
  const birthDate = formData.get("birthDate") as string;
  const position = formData.get("position") as string;
  const favoriteFood = formData.get("favoriteFood") as string;
  const funFact = formData.get("funFact") as string;
  const boyGroupId = formData.get("boyGroupId") as string;
  const photoUrl = formData.get("photoUrl") as string;

  await prisma.member.update({
    where: { id },
    data: {
      stageName,
      realName,
      birthDate: new Date(birthDate),
      position,
      favoriteFood,
      funFact,
      boyGroupId,
      photoUrl: photoUrl || null,
    },
  });

  revalidatePath("/admin/idols");
  redirect("/admin/idols");
}

export async function deleteMember(id: string) {
  await prisma.member.delete({ where: { id } });
  revalidatePath("/admin/idols");
}