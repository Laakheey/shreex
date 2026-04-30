"use server";

import { db } from "@/lib/db";
import { tokenRequests, transactions, investments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserHistory(userId: string) {
  const [purchases, txs, invs] = await Promise.all([
    db.select().from(tokenRequests).where(eq(tokenRequests.userId, userId)),
    db.select().from(transactions).where(eq(transactions.userId, userId)),
    db.select().from(investments).where(eq(investments.userId, userId)),
  ]);

  const allItems = [
    ...purchases.map((p) => ({
      id: p.id,
      type: "token_purchase" as const,
      amount: Number(p.amountUsdt),
      status: p.status,
      description:
        p.status === "conflicted"
          ? `Mismatch: detected ${p.detectedAmount}`
          : null,
      tx_hash: p.txHash,
      created_at: p.createdAt.toISOString(),
      source: "token_request" as const,
    })),
    ...txs.map((t) => ({
      id: t.id,
      type: t.type || "unknown",
      amount: Number(t.amount),
      status: t.status,
      description: t.description,
      tx_hash: t.referenceId,
      created_at: t.createdAt.toISOString(),
      source: "transaction" as const,
    })),
    ...invs.map((i) => ({
      id: i.id,
      type: "investment" as const,
      amount: Number(i.amountTokens || i.initialAmount || 0),
      status: i.status,
      description: i.planType ? `Plan: ${i.planType}` : null,
      plan_type: i.planType,
      tx_hash: null,
      created_at:
        i.createdAt?.toISOString() || i.startDate || new Date().toISOString(),
      source: "investment" as const,
    })),
  ];

  allItems.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return allItems;
}
