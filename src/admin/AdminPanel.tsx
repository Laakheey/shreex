import React, { useState, Suspense } from "react";
import { Users, CreditCard, MessageSquare } from "lucide-react";
import UsersManagement from "./UsersManagement";
import UserWithdrawal from "./withdrawal/UserWithdrawal"; // fixed typo
import SupportDashboard from "./SupportDashboard";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "withdrawals" | "chat">("users");

  const tabs = [
    {
      id: "users",
      label: "Users",
      icon: <Users size={24} />,
      sub: "Manage balances & status",
    },
    {
      id: "withdrawals",
      label: "Withdrawals",
      icon: <CreditCard size={24} />,
      sub: "Review requests",
    },
    {
      id: "chat",
      label: "Support Chat",
      icon: <MessageSquare size={24} />,
      sub: "User conversations",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersManagement />;
      case "withdrawals":
        return <UserWithdrawal />;
      case "chat":
        return <SupportDashboard />;
      default:
        return <div className="p-10 text-center text-gray-500">Select a section</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">
        Admin Dashboard
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex flex-row lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group flex items-center gap-4 p-4 md:p-5 rounded-3xl font-medium transition-all border-2 text-left cursor-pointer whitespace-nowrap min-w-45 lg:min-w-auto ${
                activeTab === tab.id
                  ? "bg-green-600 text-white border-green-600 shadow-xl shadow-green-200/50"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700 hover:shadow-md"
              }`}
            >
              <div
                className={`p-3 rounded-2xl transition-colors ${
                  activeTab === tab.id ? "bg-white/20" : "bg-green-50 text-green-600"
                }`}
              >
                {tab.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-base md:text-lg font-semibold">{tab.label}</span>
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

        <div className="flex-1 bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden min-h-125">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <span className="ml-4 text-gray-600">Loading...</span>
              </div>
            }
          >
            {renderContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;