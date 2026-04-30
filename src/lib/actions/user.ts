"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return user ?? null;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user ?? null;
}

export async function ensureUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const [existing] = await db.select().from(users).where(eq(users.id, userId));
  if (existing) return existing;

  const [created] = await db.insert(users).values({ id: userId }).returning();
  return created;
}

export async function checkIsAdmin() {
  const user = await getCurrentUser();
  return user?.isAdmin ?? false;
}
