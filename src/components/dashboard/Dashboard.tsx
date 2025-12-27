import React, { useState, Suspense, lazy } from "react";
import BalanceCard from "./BalanceCard";
import { UserProfileSync } from "..";
import MonthlyPlanCard from "./MonthlyPlanCard";
import HalfYearPlanCard from "./HalfYearPlanCard";
import YearlyPlanCard from "./FixedPlanCard"; 
import ActiveInvestmentsCard from "./ActiveInvestmentsCard";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useFetchInvestments } from "../../hooks/useFetchInvestment";
import BuyTokensCardTest from "./BuyTokenCardWithWebhook";
import CashOutCardTest from "./CashOutCardTest";

const ROIPage = lazy(() => import("../../components/userRoi/ROI"));
const SupportPage = lazy(() => import("../supportAndGrowth/SupportAndGrowthHome"));

const TabLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-gray-400 font-medium">Loading section...</p>
  </div>
);

const Dashboard: React.FC = () => {
  type Tab = "invest" | "roi" | "support";
  const [activeTab, setActiveTab] = useState<Tab>("invest");
  const { balance, mutate: mutateBalance } = useTokenBalance();
  const {
    investments,
    loading: investmentsLoading,
    mutate: mutateInvestments,
  } = useFetchInvestments();

  const handleRefresh = async () => {
    await Promise.all([mutateBalance(), mutateInvestments()]);
  };

  return (
    <>
      <UserProfileSync />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          
          <div className="mb-10">
            <BalanceCard balance={balance} isLoaded />
          </div>

          <div className="flex space-x-2 mb-8 bg-gray-200/50 p-1.5 rounded-2xl w-fit sticky top-4 z-10 backdrop-blur-md">
            {["invest", "roi", "support"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${
                  activeTab === tab 
                    ? "bg-white text-indigo-600 shadow-md scale-105" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/30"
                }`}
              >
                {tab === "invest" ? "Investments" : tab === "roi" ? "ROI Portfolio" : "Support"}
              </button>
            ))}
          </div>

          <Suspense fallback={<TabLoader />}>
            {activeTab === "invest" && (
              <div className="space-y-12">
                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">Wallet Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BuyTokensCardTest onBuySuccess={handleRefresh} />
                    <CashOutCardTest currentBalance={balance} onSuccess={mutateBalance} />
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">Investment Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <MonthlyPlanCard currentBalance={balance} mutate={mutateBalance} onInvestmentSuccess={mutateInvestments} />
                    <HalfYearPlanCard currentBalance={balance} mutate={mutateBalance} onInvestmentSuccess={mutateInvestments} />
                    <YearlyPlanCard currentBalance={balance} mutate={mutateBalance} onInvestmentSuccess={mutateInvestments} />
                  </div>
                </section>

                <ActiveInvestmentsCard
                  investments={investments}
                  loading={investmentsLoading}
                  onWithdrawSuccess={handleRefresh}
                />
              </div>
            )}

            {activeTab === "roi" && <ROIPage />}
            {activeTab === "support" && <SupportPage />}
          </Suspense>

        </div>
      </div>
      {/* <CashOutCardTest currentBalance={balance} onSuccess={mutateBalance}/> */}
    </>
  );
};

export default Dashboard;