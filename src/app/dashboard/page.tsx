import { getTokenBalance } from "@/lib/actions/token-balance";
import { getActiveInvestments } from "@/lib/actions/investments";
import { getCurrentUser } from "@/lib/actions/user";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const [balance, investments, user] = await Promise.all([
    getTokenBalance(),
    getActiveInvestments(),
    getCurrentUser(),
  ]);

  const serializedInvestments = investments.map((inv) => ({
    id: inv.id,
    userId: inv.userId,
    amountTokens: Number(inv.amountTokens),
    initialAmount: Number(inv.initialAmount),
    planType: inv.planType,
    status: inv.status,
    startDate: inv.startDate,
    createdAt: inv.createdAt.toISOString(),
  }));

  return (
    <DashboardClient
      initialBalance={balance}
      initialInvestments={serializedInvestments}
      isLeader={user?.isLeader ?? false}
    />
  );
}
