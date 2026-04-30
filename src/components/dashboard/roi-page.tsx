"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, BarChart3, Calendar } from "lucide-react";
import { getUserFinanceData } from "@/lib/actions/roi";

export function ROIPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserFinanceData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        No financial data available yet
      </div>
    );
  }

  const { stats, rewards, withdrawals: wdList } = data;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Lifetime ROI",
            value: stats.total,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            label: "Monthly ROI",
            value: stats.monthly,
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "This Month",
            value: stats.currentMonthEarning,
            icon: DollarSign,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
          {
            label: "Yearly ROI",
            value: stats.yearly,
            icon: BarChart3,
            color: "text-orange-600",
            bg: "bg-orange-100",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`${stat.bg} p-2 rounded-xl`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stat.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recent Rewards
        </h3>
        {rewards.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No rewards yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">
                    Plan
                  </th>
                  <th className="text-right py-3 px-2 text-gray-500 font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {rewards.slice(0, 20).map((r: any) => (
                  <tr key={r.id} className="border-b border-gray-50">
                    <td className="py-3 px-2">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 capitalize">{r.plan_type}</td>
                    <td className="py-3 px-2 text-right font-semibold text-green-600">
                      +{Number(r.amount_added).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Withdrawal History
        </h3>
        {wdList.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No withdrawals yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">
                    Date
                  </th>
                  <th className="text-right py-3 px-2 text-gray-500 font-medium">
                    Amount
                  </th>
                  <th className="text-center py-3 px-2 text-gray-500 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {wdList.slice(0, 20).map((w: any) => (
                  <tr key={w.id} className="border-b border-gray-50">
                    <td className="py-3 px-2">
                      {new Date(w.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold">
                      {w.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          w.status === "approved" || w.status === "sent"
                            ? "bg-green-100 text-green-700"
                            : w.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
