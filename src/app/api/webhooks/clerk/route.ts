import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    if (type === "user.created" || type === "user.updated") {
      const userId = data.id;
      const email =
        data.email_addresses?.[0]?.email_address || data.primary_email || null;
      const firstName = data.first_name || null;
      const lastName = data.last_name || null;

      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (existing) {
        await db
          .update(users)
          .set({ email, firstName, lastName })
          .where(eq(users.id, userId));
      } else {
        const referralCode = `REF-${userId.slice(-6).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
        await db.insert(users).values({
          id: userId,
          email,
          firstName,
          lastName,
          referralCode,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
