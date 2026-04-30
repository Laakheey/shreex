import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, payoutWallets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({ isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.id, userId));

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const { name, address, private_key } = await req.json();

    if (!name?.trim() || !address?.trim() || !private_key?.trim()) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    await db.insert(payoutWallets).values({
      name: name.trim(),
      address: address.trim(),
      encryptedPrivateKey: private_key.trim(),
      isActive: true,
    });

    return NextResponse.json({ message: "Wallet added" });
  } catch (error: any) {
    console.error("Add wallet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
