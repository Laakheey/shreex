"use client";

import { useState, useCallback, lazy, Suspense } from "react";
import { BalanceCard } from "./balance-card";
import { MonthlyPlanCard } from "./monthly-plan-card";
import { HalfYearPlanCard } from "./half-year-plan-card";
import { YearlyPlanCard } from "./yearly-plan-card";
import { ActiveInvestmentsCard } from "./active-investments-card";
import { BuyTokensCard } from "./buy-tokens-card";
import { CashOutCard } from "./cashout-card";
import { ReferralRules } from "./referral-rules";
import { GrowthSection } from "./growth-section";
import { getTokenBalance } from "@/lib/actions/token-balance";
import { getActiveInvestments } from "@/lib/actions/investments";

const ROIPage = lazy(() =>
  import("./roi-page").then((m) => ({ default: m.ROIPage }))
);
const SupportPage = lazy(() =>
  import("./support-page").then((m) => ({ default: m.SupportPage }))
);

interface SerializedInvestment {
  id: number;
  userId: string;
  amountTokens: number;
  initialAmount: number;
  planType: string;
  status: string;
  startDate: string | null;
  createdAt: string;
}

interface Props {
  initialBalance: number;
  initialInvestments: SerializedInvestment[];
  isLeader: boolean;
}

const TabLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-gray-400 font-medium">Loading section...</p>
  </div>
);

type Tab = "invest" | "roi" | "support";

export function DashboardClient({
  initialBalance,
  initialInvestments,
  isLeader,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("invest");
  const [balance, setBalance] = useState(initialBalance);
  const [investments, setInvestments] = useState(initialInvestments);

  const refresh = useCallback(async () => {
    const [newBalance, newInvestments] = await Promise.all([
      getTokenBalance(),
      getActiveInvestments(),
    ]);
    setBalance(newBalance);
    setInvestments(
      newInvestments.map((inv) => ({
        id: inv.id,
        userId: inv.userId,
        amountTokens: Number(inv.amountTokens),
        initialAmount: Number(inv.initialAmount),
        planType: inv.planType,
        status: inv.status,
        startDate: inv.startDate,
        createdAt: inv.createdAt.toISOString(),
      }))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10">
          <BalanceCard balance={balance} />
        </div>

        <div className="flex space-x-2 mb-8 bg-gray-200/50 p-1.5 rounded-2xl w-fit sticky top-4 z-10 backdrop-blur-md">
          {(["invest", "roi", "support"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-indigo-600 shadow-md scale-105"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/30"
              }`}
            >
              {tab === "invest"
                ? "Investments"
                : tab === "roi"
                  ? "ROI Portfolio"
                  : "Support"}
            </button>
          ))}
        </div>

        <Suspense fallback={<TabLoader />}>
          {activeTab === "invest" && (
            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">
                  Wallet Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <BuyTokensCard onBuySuccess={refresh} />
                  <CashOutCard
                    currentBalance={balance}
                    onSuccess={refresh}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">
                  Investment Plans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <MonthlyPlanCard
                    currentBalance={balance}
                    onSuccess={refresh}
                  />
                  <HalfYearPlanCard
                    currentBalance={balance}
                    onSuccess={refresh}
                  />
                  <YearlyPlanCard
                    currentBalance={balance}
                    onSuccess={refresh}
                  />
                </div>
              </section>

              <GrowthSection />
              <ReferralRules />

              <ActiveInvestmentsCard
                investments={investments}
                onWithdrawSuccess={refresh}
                isUserLeader={isLeader}
              />
            </div>
          )}

          {activeTab === "roi" && <ROIPage />}
          {activeTab === "support" && <SupportPage />}
        </Suspense>
      </div>
    </div>
  );
}
