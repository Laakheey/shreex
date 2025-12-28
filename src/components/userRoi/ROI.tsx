import React from "react";
import { useUserFinanceData } from "../../hooks/useROILogs";
import Loading from "../Loading";
import { StatCard } from "./StatCard";
import { HistoryTable } from "./HistoryTable";

const ROIPage: React.FC = () => {
  const { rewards, 
    withdrawals, 
    // monthlyStats, 
    stats, 
    loading 
  } =
    useUserFinanceData();

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Detailed breakdown of your investment performance.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            title="Lifetime ROI"
            value={stats.total}
            color="text-indigo-600"
            subtitle="Total interest generated"
          />
          <StatCard
            title="Monthly Plans"
            value={stats.monthly}
            color="text-green-600"
            subtitle="Earnings from monthly plan"
          />
          <StatCard
            title="Half Yearly Plans"
            value={stats.halfYearly}
            color="text-blue-600"
            subtitle="Earnings from half-yearly plan"
          />
          <StatCard
            title="Yearly Plans"
            value={stats.yearly}
            color="text-blue-600"
            subtitle="Earnings from yearly plan"
          />
          {/* <StatCard
            title="This Month"
            value={stats.currentMonthEarning}
            color="text-orange-600"
            subtitle="Total earned in Dec 2025"
          /> */}
        </div>

        {/* {monthlyStats.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Performance Snapshot
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {monthlyStats.slice(0, 6).map((m) => (
                <div
                  key={m.month_year}
                  className="min-w-35 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center"
                >
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    {new Date(m.month_year).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-lg font-black text-gray-800">
                    +{Number(m.monthly_roi).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )} */}

        <div className="space-y-8">
          <HistoryTable title="Reward Logs" data={rewards} type="rewards" />
          <HistoryTable
            title="Withdrawal Logs"
            data={withdrawals}
            type="withdrawals"
          />
        </div>
      </div>
    </div>
  );
};

export default ROIPage;
