"use client";

import { useState, Suspense, lazy } from "react";
import { Users, CreditCard, MessageSquare, BarChart3 } from "lucide-react";
import { Toaster } from "react-hot-toast";

const AdminStatsView = lazy(() =>
  import("./admin-stats").then((m) => ({ default: m.AdminStatsView }))
);
const UsersManagementView = lazy(() =>
  import("./users-management").then((m) => ({
    default: m.UsersManagementView,
  }))
);
const WithdrawalsView = lazy(() =>
  import("./withdrawals-view").then((m) => ({ default: m.WithdrawalsView }))
);
const SupportDashboard = lazy(() =>
  import("./support-dashboard").then((m) => ({ default: m.SupportDashboard }))
);

type Tab = "stats" | "users" | "withdrawals" | "chat";

const tabs: { id: Tab; label: string; icon: typeof Users; sub: string }[] = [
  { id: "stats", label: "Financials", icon: BarChart3, sub: "Revenue" },
  { id: "users", label: "Users", icon: Users, sub: "Manage" },
  {
    id: "withdrawals",
    label: "Withdrawals",
    icon: CreditCard,
    sub: "Review",
  },
  { id: "chat", label: "Support", icon: MessageSquare, sub: "Chat" },
];

export function AdminPanelClient() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-72 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-4 p-4 rounded-2xl font-medium transition-all border-2 text-left cursor-pointer whitespace-nowrap min-w-[140px] lg:min-w-0 ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white border-green-600 shadow-xl shadow-green-200/50"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700 hover:shadow-md"
                }`}
              >
                <div
                  className={`p-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? "bg-white/20"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  <tab.icon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold">{tab.label}</span>
                  <span
                    className={`text-xs opacity-70 ${
                      activeTab === tab.id ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {tab.sub}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden min-h-[500px]">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
                  <span className="ml-4 text-gray-600">Loading...</span>
                </div>
              }
            >
              {activeTab === "stats" && <AdminStatsView />}
              {activeTab === "users" && <UsersManagementView />}
              {activeTab === "withdrawals" && <WithdrawalsView />}
              {activeTab === "chat" && <SupportDashboard />}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
