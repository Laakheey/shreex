import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, withdrawals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, walletAddress } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!walletAddress?.trim()) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    const [user] = await db
      .select({ tokenBalance: users.tokenBalance })
      .from(users)
      .where(eq(users.id, userId));

    if (!user || Number(user.tokenBalance) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({ tokenBalance: String(Number(user.tokenBalance) - amount) })
      .where(eq(users.id, userId));

    const txHash = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    await db.insert(withdrawals).values({
      userId,
      amount: String(amount),
      walletAddress: walletAddress.trim(),
      status: "pending",
      txHash,
    });

    return NextResponse.json({ txHash, message: "Withdrawal submitted" });
  } catch (error: any) {
    console.error("Withdrawal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
