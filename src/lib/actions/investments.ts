"use server";

import { db } from "@/lib/db";
import { investments, users, transactions } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getActiveInvestments() {
  const { userId } = await auth();
  if (!userId) return [];

  return db
    .select()
    .from(investments)
    .where(and(eq(investments.userId, userId), eq(investments.status, "active")))
    .orderBy(sql`${investments.createdAt} DESC`);
}

export async function invest(
  amount: number,
  plan: "monthly" | "half-yearly" | "yearly",
  currentBalance: number
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  if (amount <= 0 || amount > currentBalance) {
    return { success: false, error: "Invalid amount" };
  }

  try {
    const [invData] = await db
      .insert(investments)
      .values({
        userId,
        amountTokens: String(amount),
        initialAmount: String(amount),
        planType: plan,
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
      })
      .returning({ id: investments.id });

    const newBalance = currentBalance - amount;
    await db
      .update(users)
      .set({ tokenBalance: String(newBalance) })
      .where(eq(users.id, userId));

    const planLabel =
      plan === "monthly"
        ? "Monthly"
        : plan === "half-yearly"
          ? "6-Month"
          : "Yearly";

    await db.insert(transactions).values({
      userId,
      type: "investment_deposit",
      amount: String(amount),
      planType: plan,
      investmentId: invData.id,
      description: `Invested ${amount.toLocaleString()} tokens in ${planLabel} plan`,
    });

    revalidatePath("/dashboard");

    const successMsg =
      plan === "monthly"
        ? `${amount.toLocaleString()} tokens invested! 10% monthly rewards started.`
        : plan === "half-yearly"
          ? `${amount.toLocaleString()} tokens locked! 1.75x return in 6 months.`
          : `${amount.toLocaleString()} tokens locked! 3x return in 1 year.`;

    return { success: true, message: successMsg };
  } catch (error: any) {
    console.error("Investment error:", error);
    return { success: false, error: error.message || "Investment failed" };
  }
}

export async function withdrawFromInvestment(
  investmentId: number,
  amount: number,
  planType: string,
  startDate: string
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const [inv] = await db
      .select()
      .from(investments)
      .where(
        and(
          eq(investments.id, investmentId),
          eq(investments.userId, userId),
          eq(investments.status, "active")
        )
      );

    if (!inv) return { success: false, error: "Investment not found" };

    const invAmount = Number(inv.amountTokens);
    if (amount <= 0 || amount > invAmount) {
      return { success: false, error: "Invalid withdrawal amount" };
    }

    const [userData] = await db
      .select({ tokenBalance: users.tokenBalance })
      .from(users)
      .where(eq(users.id, userId));

    const currentBalance = Number(userData?.tokenBalance) || 0;
    const newBalance = currentBalance + amount;

    await db
      .update(users)
      .set({ tokenBalance: String(newBalance) })
      .where(eq(users.id, userId));

    if (amount >= invAmount) {
      await db
        .update(investments)
        .set({ status: "inactive" })
        .where(eq(investments.id, investmentId));
    } else {
      const remaining = invAmount - amount;
      await db
        .update(investments)
        .set({ status: "inactive" })
        .where(eq(investments.id, investmentId));

      await db.insert(investments).values({
        userId,
        planType,
        amountTokens: String(remaining),
        startDate,
        status: "active",
      });
    }

    await db.insert(transactions).values({
      userId,
      type: "withdrawal",
      amount: String(amount),
      planType,
      investmentId,
      description: `Withdrew ${amount.toLocaleString()} tokens from ${planType} investment`,
    });

    revalidatePath("/dashboard");
    return { success: true, message: `Successfully moved ${amount.toLocaleString()} to your wallet!` };
  } catch (error: any) {
    console.error("Withdrawal error:", error);
    return { success: false, error: error.message || "Withdrawal failed" };
  }
}
