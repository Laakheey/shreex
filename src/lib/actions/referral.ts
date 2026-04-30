"use server";

import { db } from "@/lib/db";
import { users, referralBonuses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getReferralData() {
  const { userId } = await auth();
  if (!userId) return null;

  const [userData] = await db
    .select({
      referrerId: users.referrerId,
      referralCode: users.referralCode,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!userData) return null;

  const bonusData = await db
    .select({
      amount: referralBonuses.amount,
      bonusType: referralBonuses.bonusType,
    })
    .from(referralBonuses)
    .where(eq(referralBonuses.referrerId, userId));

  const oneTime = bonusData
    .filter((b) => b.bonusType === "first_investment")
    .reduce((sum, b) => sum + Number(b.amount), 0);
  const ongoing = bonusData
    .filter((b) => b.bonusType === "ongoing")
    .reduce((sum, b) => sum + Number(b.amount), 0);

  return {
    myReferralCode: userData.referralCode || userId,
    hasReferrer: !!userData.referrerId,
    bonuses: {
      one_time_total: oneTime,
      ongoing_total: ongoing,
      grand_total: oneTime + ongoing,
    },
  };
}
