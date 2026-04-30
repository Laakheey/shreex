"use server";

import { db } from "@/lib/db";
import {
  users,
  tokenRequests,
  adminTransactions,
  supportMessages,
  adminEarningsDashboard,
} from "@/lib/db/schema";
import { eq, sql, desc, asc } from "drizzle-orm";
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

export async function getUsers(page = 1, pageSize = 20) {
  await requireAdmin();

  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        tokenBalance: users.tokenBalance,
        createdAt: users.createdAt,
        isAdmin: users.isAdmin,
        isActive: users.isActive,
      })
      .from(users)
      .orderBy(sql`${users.tokenBalance}::numeric DESC`)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(users),
  ]);

  const total = countResult[0]?.count ?? 0;
  return {
    users: data,
    totalUsers: total,
    currentPage: page,
    totalPages: Math.ceil(total / pageSize),
    pageSize,
  };
}

export async function updateUserBalance(userId: string, newBalance: number) {
  await requireAdmin();

  if (typeof newBalance !== "number" || newBalance < 0) {
    return { success: false, error: "Invalid balance" };
  }

  const [user] = await db
    .select({ tokenBalance: users.tokenBalance })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) return { success: false, error: "User not found" };

  const oldBalance = Number(user.tokenBalance) || 0;
  const difference = newBalance - oldBalance;

  await db
    .update(users)
    .set({ tokenBalance: String(newBalance) })
    .where(eq(users.id, userId));

  if (difference !== 0) {
    await db.insert(adminTransactions).values({
      userId,
      amount: String(Math.abs(difference)),
      transactionType: difference >= 0 ? "credit" : "debit",
      description: `Admin adjusted balance ${difference >= 0 ? "+" : ""}${difference} tokens`,
    });
  }

  revalidatePath("/admin/adminPanel");
  return {
    success: true,
    newBalance,
    previousBalance: oldBalance,
    difference,
  };
}

export async function getUserTransactions(userId: string, page = 1, pageSize = 50) {
  await requireAdmin();
  const offset = (page - 1) * pageSize;

  const [requests, adminTxs] = await Promise.all([
    db
      .select()
      .from(tokenRequests)
      .where(eq(tokenRequests.userId, userId))
      .orderBy(desc(tokenRequests.createdAt)),
    db
      .select()
      .from(adminTransactions)
      .where(eq(adminTransactions.userId, userId))
      .orderBy(desc(adminTransactions.createdAt)),
  ]);

  const combined = [
    ...requests.map((r) => ({
      id: r.requestId || String(r.id),
      type: "token_request" as const,
      amount: Number(r.amountUsdt),
      status: r.status,
      created_at: r.createdAt.toISOString(),
      details: {
        tx_hash: r.txHash,
        screenshot_url: r.screenshotUrl,
        detected_amount: r.detectedAmount ? Number(r.detectedAmount) : null,
      },
    })),
    ...adminTxs.map((t) => ({
      id: t.id,
      type: "admin_adjustment" as const,
      amount: Number(t.amount),
      transaction_type: t.transactionType,
      description: t.description,
      created_at: t.createdAt.toISOString(),
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return {
    transactions: combined.slice(offset, offset + pageSize),
    total: combined.length,
    currentPage: page,
    totalPages: Math.ceil(combined.length / pageSize),
  };
}

export async function getDashboardStats() {
  await requireAdmin();

  const [userCount, tokenSum, pendingCount, recentTxCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(users),
    db
      .select({ total: sql<string>`coalesce(sum(token_balance::numeric), 0)::text` })
      .from(users),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(tokenRequests)
      .where(eq(tokenRequests.status, "pending")),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(tokenRequests),
  ]);

  return {
    totalUsers: userCount[0]?.count ?? 0,
    totalTokens: Number(tokenSum[0]?.total) || 0,
    pendingRequests: pendingCount[0]?.count ?? 0,
    recentTransactions: recentTxCount[0]?.count ?? 0,
    timestamp: new Date().toISOString(),
  };
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  await requireAdmin();
  await db.update(users).set({ isActive }).where(eq(users.id, userId));
  revalidatePath("/admin/adminPanel");
  return { success: true };
}

export async function getSupportChats() {
  await requireAdmin();

  const allMessages = await db
    .select({
      userId: supportMessages.userId,
      content: supportMessages.content,
      imageUrl: supportMessages.imageUrl,
      isAdminReply: supportMessages.isAdminReply,
      createdAt: supportMessages.createdAt,
    })
    .from(supportMessages)
    .orderBy(desc(supportMessages.createdAt));

  const userMap = new Map<string, typeof allMessages>();
  for (const msg of allMessages) {
    if (!userMap.has(msg.userId)) userMap.set(msg.userId, []);
    userMap.get(msg.userId)!.push(msg);
  }

  const userIds = Array.from(userMap.keys());
  if (userIds.length === 0) return [];

  const usersData = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(sql`${users.id} = ANY(${userIds})`);

  const chats = Array.from(userMap.entries()).map(([userId, msgs]) => {
    const userInfo = usersData.find((u) => u.id === userId);
    const lastMsg = msgs[0];
    const unreadCount = msgs.filter((m) => !m.isAdminReply).length;

    return {
      user_id: userId,
      user_name:
        `${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`.trim() ||
        "User",
      user_email: userInfo?.email || "No email",
      last_message: lastMsg.imageUrl ? "Image" : lastMsg.content || "Message",
      last_message_time: lastMsg.createdAt.toISOString(),
      unread_count: unreadCount,
    };
  });

  chats.sort(
    (a, b) =>
      new Date(b.last_message_time).getTime() -
      new Date(a.last_message_time).getTime()
  );

  return chats;
}

export async function getChatMessages(targetUserId: string) {
  await requireAdmin();

  return db
    .select({
      id: supportMessages.id,
      content: supportMessages.content,
      imageUrl: supportMessages.imageUrl,
      isAdminReply: supportMessages.isAdminReply,
      createdAt: supportMessages.createdAt,
    })
    .from(supportMessages)
    .where(eq(supportMessages.userId, targetUserId))
    .orderBy(asc(supportMessages.createdAt));
}

export async function sendAdminReply(
  targetUserId: string,
  content: string,
  imageUrl?: string
) {
  await requireAdmin();

  const [msg] = await db
    .insert(supportMessages)
    .values({
      userId: targetUserId,
      content: content.trim() || null,
      imageUrl: imageUrl || null,
      isAdminReply: true,
    })
    .returning();

  revalidatePath("/admin/adminPanel");
  return msg;
}

export async function getAdminEarnings() {
  await requireAdmin();
  const [data] = await db.select().from(adminEarningsDashboard);
  return data ?? null;
}
