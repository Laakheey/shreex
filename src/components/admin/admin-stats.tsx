"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, Clock, Activity } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/admin";

export function AdminStatsView() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-gray-500">
        Failed to load stats
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Tokens",
      value: stats.totalTokens.toLocaleString(),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests.toLocaleString(),
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Total Transactions",
      value: stats.recentTransactions.toLocaleString(),
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`${card.bg} p-2 rounded-xl`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {card.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
