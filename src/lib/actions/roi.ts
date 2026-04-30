"use server";

import { db } from "@/lib/db";
import {
  userEarningSummaries,
  userMonthlyPerformance,
  interestPayouts,
  investments,
  withdrawals,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getUserFinanceData() {
  const { userId } = await auth();
  if (!userId) return null;

  const [summaryData, monthlyData, payoutData, withdrawalData] =
    await Promise.all([
      db
        .select()
        .from(userEarningSummaries)
        .where(eq(userEarningSummaries.userId, userId))
        .limit(1),
      db
        .select()
        .from(userMonthlyPerformance)
        .where(eq(userMonthlyPerformance.userId, userId))
        .orderBy(desc(userMonthlyPerformance.monthYear))
        .limit(100),
      db
        .select({
          id: interestPayouts.id,
          amountAdded: interestPayouts.amountAdded,
          createdAt: interestPayouts.createdAt,
          planType: investments.planType,
          initialAmount: investments.initialAmount,
        })
        .from(interestPayouts)
        .innerJoin(
          investments,
          eq(interestPayouts.investmentId, investments.id)
        )
        .where(eq(investments.userId, userId))
        .orderBy(desc(interestPayouts.createdAt)),
      db
        .select()
        .from(withdrawals)
        .where(eq(withdrawals.userId, userId))
        .orderBy(desc(withdrawals.createdAt)),
    ]);

  const summary = summaryData[0];
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const currentMonth = monthlyData.find(
    (m) => m.monthYear === currentMonthStr
  );

  return {
    stats: {
      total: Number(summary?.totalLifetimeRoi) || 0,
      monthly: Number(summary?.totalMonthlyRoi) || 0,
      halfYearly: Number(summary?.totalHalfYearlyRoi) || 0,
      yearly: Number(summary?.totalYearlyRoi) || 0,
      currentMonthEarning: Number(currentMonth?.monthlyRoi) || 0,
    },
    monthlyStats: monthlyData.map((m) => ({
      ...m,
      monthlyRoi: Number(m.monthlyRoi),
    })),
    rewards: payoutData.map((p) => ({
      id: p.id,
      amount_added: Number(p.amountAdded),
      created_at: p.createdAt.toISOString(),
      plan_type: p.planType,
      initial_amount: Number(p.initialAmount),
    })),
    withdrawals: withdrawalData.map((w) => ({
      ...w,
      amount: Number(w.amount),
      created_at: w.createdAt.toISOString(),
    })),
  };
}
