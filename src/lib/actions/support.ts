"use server";

import { db } from "@/lib/db";
import { supportMessages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

const PAGE_SIZE = 40;

export async function getSupportMessages(beforeTimestamp?: string) {
  const { userId } = await auth();
  if (!userId) return { messages: [], hasMore: false };

  let query = db
    .select({
      id: supportMessages.id,
      content: supportMessages.content,
      imageUrl: supportMessages.imageUrl,
      isAdminReply: supportMessages.isAdminReply,
      createdAt: supportMessages.createdAt,
    })
    .from(supportMessages)
    .where(eq(supportMessages.userId, userId))
    .orderBy(desc(supportMessages.createdAt))
    .limit(PAGE_SIZE + 1);

  if (beforeTimestamp) {
    query = db
      .select({
        id: supportMessages.id,
        content: supportMessages.content,
        imageUrl: supportMessages.imageUrl,
        isAdminReply: supportMessages.isAdminReply,
        createdAt: supportMessages.createdAt,
      })
      .from(supportMessages)
      .where(eq(supportMessages.userId, userId))
      .orderBy(desc(supportMessages.createdAt))
      .limit(PAGE_SIZE + 1);
  }

  const data = await query;

  const hasMore = data.length > PAGE_SIZE;
  const sliced = hasMore ? data.slice(0, PAGE_SIZE) : data;

  return {
    messages: sliced.reverse().map((m) => ({
      ...m,
      created_at: m.createdAt.toISOString(),
    })),
    hasMore,
  };
}

export async function sendSupportMessage(content: string, imageUrl?: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const [msg] = await db
    .insert(supportMessages)
    .values({
      userId,
      content: content.trim() || null,
      imageUrl: imageUrl || null,
      isAdminReply: false,
    })
    .returning();

  return {
    ...msg,
    created_at: msg.createdAt.toISOString(),
  };
}
