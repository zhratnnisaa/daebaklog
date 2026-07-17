"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createAlbumOrder(albumId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const quantity = Number(formData.get("quantity"));

  const album = await prisma.album.findUnique({ where: { id: albumId } });
  if (!album) throw new Error("Album tidak ditemukan");
  if (quantity > album.stock) throw new Error("Stok tidak cukup");

  const totalPrice = album.price * quantity;

  const order = await prisma.albumOrder.create({
    data: {
      userId: session.user.id as string,
      albumId,
      quantity,
      totalPrice,
      status: "PENDING",
    },
  });

  redirect(`/checkout/album/${order.id}`);
}

export async function simulateAlbumPayment(orderId: string, result: "PAID" | "FAILED") {
  const order = await prisma.albumOrder.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order tidak ditemukan");

  if (result === "PAID") {
    await prisma.album.update({
      where: { id: order.albumId },
      data: { stock: { decrement: order.quantity } },
    });
  }

  await prisma.albumOrder.update({
    where: { id: orderId },
    data: { status: result },
  });

  revalidatePath(`/checkout/album/${orderId}`);
}

export async function adminUpdateAlbumOrderStatus(orderId: string, formData: FormData) {
  const status = formData.get("status") as "PENDING" | "PAID" | "FAILED" | "CANCELLED";

  await prisma.albumOrder.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
}