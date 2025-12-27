import React from "react";
import { useUserFinanceData } from "../../hooks/useROILogs";
import Loading from "../Loading";

const ROIPage: React.FC = () => {
  const { rewards, withdrawals, stats, loading } = useUserFinanceData();

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">ROI Portfolio</h1>
          <p className="text-gray-500 mt-2">Track your daily earnings and lifetime performance.</p>
        </header>

        {/* Stats Cards - Now showing Lifetime Totals */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Lifetime Total"
            value={stats.total}
            color="text-indigo-600"
            subtitle="Total profit earned"
          />
          <StatCard
            title="Monthly ROI"
            value={stats.monthly}
            color="text-green-600"
            subtitle="All-time monthly"
          />
          <StatCard
            title="6-Month ROI"
            value={stats.halfYearly}
            color="text-purple-600"
            subtitle="All-time 6-month"
          />
          <StatCard
            title="Yearly ROI"
            value={stats.yearly}
            color="text-indigo-500"
            subtitle="All-time yearly"
          />
        </div>

        {/* Rewards History */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-12">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-gray-800">Reward History</h2>
            <span className="px-4 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-bold">
              {rewards.length} Logs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Plan</th>
                  <th className="px-8 py-4">Description</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-8 py-5 text-sm text-gray-600">{reward.date}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${reward.planBadgeClass}`}>
                        {reward.planType}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500">{reward.description}</td>
                    <td className="px-8 py-5 text-right font-black text-green-600">
                      +{reward.amountFormatted} USDT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rewards.length === 0 && (
              <div className="py-20 text-center text-gray-400 font-medium">
                No rewards earned yet. Passive income starts 24h after investment.
              </div>
            )}
          </div>
        </div>

        {/* Withdrawals History */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Withdrawal History</h2>
            <span className="px-4 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-bold">
              {withdrawals.length} Entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Wallet Address</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {withdrawals.map((wd) => (
                  <tr key={wd.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-8 py-5 text-sm text-gray-600">
                      {new Date(wd.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(wd.status)}`}>
                        {wd.status || "unknown"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-mono">
                      {wd.wallet_address ? `${wd.wallet_address.slice(0, 6)}...${wd.wallet_address.slice(-4)}` : "-"}
                    </td>
                    <td className="px-8 py-5 text-right font-black text-red-600">
                      -{Number(wd.amount).toLocaleString()} USDT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {withdrawals.length === 0 && (
              <div className="py-20 text-center text-gray-400 font-medium">
                No withdrawal requests found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, subtitle }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-between">
    <div>
      <p className="text-gray-400 text-xs font-bold uppercase mb-1 tracking-wider">{title}</p>
      <p className={`text-2xl font-black ${color}`}>
        {value.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs">USDT</span>
      </p>
    </div>
    <p className="text-[10px] text-gray-300 mt-4 uppercase font-bold tracking-tighter">{subtitle}</p>
  </div>
);

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "sent": return "bg-green-100 text-green-700";
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "rejected":
    case "failed": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default ROIPage;