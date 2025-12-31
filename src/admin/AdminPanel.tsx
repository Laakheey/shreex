// import React, { useState, Suspense } from "react";
// import { Users, CreditCard, MessageSquare } from "lucide-react";
// import UsersManagement from "./UsersManagement";
// import UserWithdrawal from "./withdrawal/UserWithdrawal";
// import SupportDashboard from "./SupportDashboard";
// import { Toaster } from "react-hot-toast";

// const AdminPanel: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"users" | "withdrawals" | "chat">(
//     "users"
//   );

//   const tabs = [
//     {
//       id: "users",
//       label: "Users",
//       icon: <Users size={24} />,
//       sub: "Manage balances & status",
//     },
//     {
//       id: "withdrawals",
//       label: "Withdrawals",
//       icon: <CreditCard size={24} />,
//       sub: "Review requests",
//     },
//     {
//       id: "chat",
//       label: "Support Chat",
//       icon: <MessageSquare size={24} />,
//       sub: "User conversations",
//     },
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case "users":
//         return <UsersManagement />;
//       case "withdrawals":
//         return <UserWithdrawal />;
//       case "chat":
//         return <SupportDashboard />;
//       default:
//         return (
//           <div className="p-10 text-center text-gray-500">Select a section</div>
//         );
//     }
//   };

//   return (
//     <>
//       <Toaster />
//       <div className="max-w-7xl mx-auto p-6 md:p-8">
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">
//           Admin Dashboard
//         </h1>

//         <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
//           <div className="w-full lg:w-72 flex flex-row lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id as any)}
//                 className={`group flex items-center gap-4 p-4 md:p-5 rounded-3xl font-medium transition-all border-2 text-left cursor-pointer whitespace-nowrap min-w-45 lg:min-w-auto ${
//                   activeTab === tab.id
//                     ? "bg-green-600 text-white border-green-600 shadow-xl shadow-green-200/50"
//                     : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700 hover:shadow-md"
//                 }`}
//               >
//                 <div
//                   className={`p-3 rounded-2xl transition-colors ${
//                     activeTab === tab.id
//                       ? "bg-white/20"
//                       : "bg-green-50 text-green-600"
//                   }`}
//                 >
//                   {tab.icon}
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-base md:text-lg font-semibold">
//                     {tab.label}
//                   </span>
//                   <span
//                     className={`text-xs opacity-70 ${
//                       activeTab === tab.id ? "text-white" : "text-gray-500"
//                     }`}
//                   >
//                     {tab.sub}
//                   </span>
//                 </div>
//               </button>
//             ))}
//           </div>

//           <div className="flex-1 bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden min-h-125">
//             <Suspense
//               fallback={
//                 <div className="flex items-center justify-center h-full p-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//                   <span className="ml-4 text-gray-600">Loading...</span>
//                 </div>
//               }
//             >
//               {renderContent()}
//             </Suspense>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminPanel;

// AdminPanel.tsx
import React, { useState, Suspense } from "react";
import { Users, CreditCard, MessageSquare, BarChart3 } from "lucide-react";
import UsersManagement from "./UsersManagement";
import UserWithdrawal from "./withdrawal/UserWithdrawal";
import SupportDashboard from "./SupportDashboard";
import AdminStats from "./AdminStats"; 
import { Toaster } from "react-hot-toast";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "withdrawals" | "chat">("stats");

  const tabs = [
    { id: "stats", label: "Financials", icon: <BarChart3 size={20} />, sub: "Revenue" },
    { id: "users", label: "Users", icon: <Users size={20} />, sub: "Manage" },
    { id: "withdrawals", label: "Withdrawals", icon: <CreditCard size={20} />, sub: "Review" },
    { id: "chat", label: "Support", icon: <MessageSquare size={20} />, sub: "Chat" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "stats": return <AdminStats />;
      case "users": return <UsersManagement />;
      case "withdrawals": return <UserWithdrawal />;
      case "chat": return <SupportDashboard />;
      default: return <AdminStats />;
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
            Admin <span className="text-green-600">Control</span>
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <nav className="w-full lg:w-72">
            <div className="flex flex-wrap lg:flex-col gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 lg:flex-none flex items-center gap-3 p-3 md:p-4 rounded-2xl md:rounded-3xl font-medium transition-all border-2 text-left cursor-pointer min-w-35 md:min-w-45 lg:min-w-full ${
                    activeTab === tab.id
                      ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                      : "bg-white text-gray-500 border-gray-100 hover:border-green-400 hover:bg-green-50/30"
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    activeTab === tab.id ? "bg-white/10 text-white" : "bg-gray-50 text-gray-400"
                  }`}>
                    {tab.icon}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm md:text-base font-bold truncate">{tab.label}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-widest opacity-60 hidden md:block`}>
                      {tab.sub}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </nav>

          <main className="flex-1 bg-white shadow-sm rounded-4xl border border-gray-100 overflow-hidden min-h-125">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600"></div>
              </div>
            }>
              {renderContent()}
            </Suspense>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;