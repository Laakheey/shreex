import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { referralCode } = await req.json();
    if (!referralCode) {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    const [currentUser] = await db
      .select({ referrerId: users.referrerId })
      .from(users)
      .where(eq(users.id, userId));

    if (currentUser?.referrerId) {
      return NextResponse.json(
        { error: "You already have a referrer" },
        { status: 400 }
      );
    }

    const [referrer] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.referralCode, referralCode));

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 404 }
      );
    }

    if (referrer.id === userId) {
      return NextResponse.json(
        { error: "Cannot refer yourself" },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({ referrerId: referrer.id })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: "Referral code applied successfully!" });
  } catch (error: any) {
    console.error("Referral apply error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
