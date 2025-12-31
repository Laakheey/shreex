// components/admin/AdminStats.tsx
import React from "react";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { useAdminStats } from "../hooks/useAdminStats";

const StatCard = ({ title, total, m, h, y, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-2xl ${colorClass.bg} ${colorClass.text}`}>
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">
        {title}
      </h3>
    </div>
    <p className="text-3xl font-black text-gray-900 mb-4">
      ${total.toLocaleString()}
    </p>
    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
      <div className="text-center">
        <p className="text-[10px] text-gray-400 uppercase font-bold">Monthly</p>
        <p className="font-bold text-gray-700 text-sm">${m.toLocaleString()}</p>
      </div>
      <div className="text-center border-x border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase font-bold">6-Month</p>
        <p className="font-bold text-gray-700 text-sm">${h.toLocaleString()}</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-gray-400 uppercase font-bold">Yearly</p>
        <p className="font-bold text-gray-700 text-sm">${y.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const AdminStats: React.FC = () => {
  const { stats, loading, error } = useAdminStats();

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse text-gray-400">
        Loading Financials...
      </div>
    );
  if (error || !stats)
    return (
      <div className="p-20 text-center text-red-500">Error loading stats.</div>
    );

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Today's Revenue"
          total={stats.today_total}
          m={stats.today_monthly}
          h={stats.today_half_yearly}
          y={stats.today_yearly}
          icon={TrendingUp}
          colorClass={{ bg: "bg-blue-50", text: "text-blue-600" }}
        />
        <StatCard
          title="This Month (MTD)"
          total={stats.mtd_total}
          m={stats.mtd_monthly}
          h={stats.mtd_half_yearly}
          y={stats.mtd_yearly}
          icon={Calendar}
          colorClass={{ bg: "bg-green-50", text: "text-green-600" }}
        />
        <StatCard
          title="Lifetime Total"
          total={stats.lifetime_total}
          m={stats.monthly_total}
          h={stats.half_yearly_total}
          y={stats.yearly_total}
          icon={DollarSign}
          colorClass={{ bg: "bg-purple-50", text: "text-purple-600" }}
        />
      </div>
    </div>
  );
};

export default AdminStats;
