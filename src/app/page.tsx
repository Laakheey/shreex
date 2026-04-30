import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { HeroSection } from "@/components/ui/hero";
import { ProductDemo } from "@/components/ui/product-demo";
import { InvestmentPlans } from "@/components/ui/investment-plans";
import { AboutUs } from "@/components/ui/about-us";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    const [user] = await db
      .select({ isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.id, userId));

    if (user?.isAdmin) redirect("/admin/adminPanel");
    redirect("/dashboard");
  }

  return (
    <>
      <HeroSection />
      <ProductDemo />
      <InvestmentPlans />
      <AboutUs />
    </>
  );
}
