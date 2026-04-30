"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getTokenBalance() {
  const { userId } = await auth();
  if (!userId) return 0;

  const [user] = await db
    .select({ tokenBalance: users.tokenBalance })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    await db.insert(users).values({ id: userId }).onConflictDoNothing();
    return 0;
  }

  return Number(user.tokenBalance) || 0;
}
