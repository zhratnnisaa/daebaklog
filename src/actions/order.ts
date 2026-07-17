"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createTicketOrder(concertId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const quantity = Number(formData.get("quantity"));

  const concert = await prisma.concert.findUnique({ where: { id: concertId } });
  if (!concert) throw new Error("Konser tidak ditemukan");
  if (quantity > concert.quota) throw new Error("Kuota tidak cukup");

  const totalPrice = concert.price * quantity;

  const order = await prisma.ticketOrder.create({
    data: {
      userId: session.user.id as string,
      concertId,
      quantity,
      totalPrice,
      status: "PENDING",
    },
  });

  redirect(`/checkout/ticket/${order.id}`);
}

export async function simulatePayment(orderId: string, result: "PAID" | "FAILED") {
  const order = await prisma.ticketOrder.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order tidak ditemukan");

  // Kalau berhasil bayar, kurangi kuota konser
  if (result === "PAID") {
    await prisma.concert.update({
      where: { id: order.concertId },
      data: { quota: { decrement: order.quantity } },
    });
  }

  await prisma.ticketOrder.update({
    where: { id: orderId },
    data: { status: result },
  });

  revalidatePath(`/checkout/ticket/${orderId}`);
}

export async function adminUpdateTicketOrderStatus(orderId: string, formData: FormData) {
  const status = formData.get("status") as "PENDING" | "PAID" | "FAILED" | "CANCELLED";

  await prisma.ticketOrder.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
}