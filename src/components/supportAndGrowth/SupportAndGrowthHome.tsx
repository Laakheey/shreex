import React, { useState, Suspense, lazy } from "react";
import { TrendingUp, LifeBuoy } from "lucide-react";

const GrowthView = lazy(() => import("./GrowthPage"));
const UserSupportChat = lazy(() => import("./SupportPage"));

const SupportAndGrowthHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"growth" | "support">("growth");

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-150 animate-in slide-in-from-bottom-4 duration-500">
      <div className="w-full md:w-72 flex flex-col gap-4">
        <button
          onClick={() => setActiveTab("growth")}
          className={`group flex items-center gap-4 p-6 rounded-4xl font-bold transition-all border-2 text-left ${
            activeTab === "growth"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100"
              : "bg-white text-gray-500 border-transparent hover:border-gray-200"
          }`}
        >
          <div
            className={`p-3 rounded-2xl transition-colors ${
              activeTab === "growth"
                ? "bg-white/20"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            <TrendingUp size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg">Growth</span>
            <span
              className={`text-[10px] font-medium opacity-60 ${
                activeTab === "growth" ? "text-white" : "text-gray-400"
              }`}
            >
              Referrals & Bonuses
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("support")}
          className={`group flex items-center gap-4 p-6 rounded-4xl font-bold transition-all border-2 text-left ${
            activeTab === "support"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100"
              : "bg-white text-gray-500 border-transparent hover:border-gray-200"
          }`}
        >
          <div
            className={`p-3 rounded-2xl transition-colors ${
              activeTab === "support"
                ? "bg-white/20"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            <LifeBuoy size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg">Support</span>
            <span
              className={`text-[10px] font-medium opacity-60 ${
                activeTab === "support" ? "text-white" : "text-gray-400"
              }`}
            >
              Chat with Admin
            </span>
          </div>
        </button>
      </div>

      {/* RIGHT SIDE: Content Area */}
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="h-full w-full flex items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          {activeTab === "growth" ? <GrowthView /> : <UserSupportChat />}
        </Suspense>
      </div>
    </div>
  );
};

export default SupportAndGrowthHome;
