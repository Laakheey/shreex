"use server";

import { db } from "@/lib/db";
import { withdrawals, users, payoutWallets } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  const [user] = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, userId));
  if (!user?.isAdmin) throw new Error("Admin access required");
  return userId;
}

export async function getWithdrawals() {
  await requireAdmin();

  const rawWithdrawals = await db
    .select()
    .from(withdrawals)
    .orderBy(desc(withdrawals.createdAt));

  if (rawWithdrawals.length === 0) return [];

  const userIds = [...new Set(rawWithdrawals.map((w) => w.userId))];
  const usersData = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(sql`${users.id} = ANY(${userIds})`);

  const userMap = new Map(usersData.map((u) => [u.id, u]));

  return rawWithdrawals.map((w) => {
    const user = userMap.get(w.userId);
    const fullName = user
      ? [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
      : "";

    return {
      ...w,
      amount: Number(w.amount),
      user_name: fullName || "Unknown User",
      user_email: user?.email || "N/A",
      withdrawal_method: w.walletAddress ? "Tron Wallet" : "Mobile Money",
    };
  });
}

export async function getPayoutWallets() {
  await requireAdmin();
  return db
    .select()
    .from(payoutWallets)
    .where(eq(payoutWallets.isActive, true));
}

export async function processWithdrawal(
  id: number,
  status: "approved" | "rejected",
  selectedWalletId?: string
) {
  await requireAdmin();

  if (status === "approved" && !selectedWalletId) {
    return { success: false, error: "Select a payout wallet" };
  }

  const [withdrawal] = await db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.id, id));

  if (!withdrawal || withdrawal.status !== "pending") {
    return { success: false, error: "Withdrawal not found or already processed" };
  }

  if (status === "rejected") {
    const [user] = await db
      .select({ tokenBalance: users.tokenBalance })
      .from(users)
      .where(eq(users.id, withdrawal.userId));

    if (user) {
      await db
        .update(users)
        .set({
          tokenBalance: String(
            Number(user.tokenBalance) + Number(withdrawal.amount)
          ),
        })
        .where(eq(users.id, withdrawal.userId));
    }

    await db
      .update(withdrawals)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(withdrawals.id, id));

    revalidatePath("/admin/adminPanel");
    return { success: true, message: "Withdrawal rejected & tokens refunded" };
  }

  const isPhone = !!withdrawal.phoneNumber;

  if (isPhone) {
    await db
      .update(withdrawals)
      .set({ status: "sent", updatedAt: new Date() })
      .where(eq(withdrawals.id, id));

    revalidatePath("/admin/adminPanel");
    return {
      success: true,
      message: `Marked as sent to ${withdrawal.phoneNumber}`,
    };
  }

  await db
    .update(withdrawals)
    .set({
      status: "approved",
      txHash: `simulated_${Date.now()}`,
      updatedAt: new Date(),
    })
    .where(eq(withdrawals.id, id));

  revalidatePath("/admin/adminPanel");
  return { success: true, message: "Withdrawal approved" };
}

export async function bulkProcess(
  ids: number[],
  status: "approved" | "rejected",
  selectedWalletId?: string
) {
  const results = await Promise.all(
    ids.map((id) => processWithdrawal(id, status, selectedWalletId))
  );
  return results;
}
