// components/HistoryTable.tsx
import React, { useState } from "react";

interface Investment {
  plan_type?: string;
  initial_amount?: number;
}

interface HistoryItem {
  id: number;
  created_at: string;
  status?: string;
  wallet_address?: string | null;
  phone_number?: string | null;
  tx_hash?: string | null;
  amount_added?: number;
  amount?: number;
  investments?: Investment;
}

interface HistoryTableProps {
  title: string;
  data: HistoryItem[];
  type: "rewards" | "withdrawals";
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  title,
  data,
  type,
}) => {
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 20, data.length));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-black text-gray-800 tracking-tight">{title}</h2>
        <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] rounded-full font-black uppercase">
          {data.length} record{data.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white border-b border-gray-100 z-10">
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4">{type === "rewards" ? "Plan" : "Status"}</th>
              <th className="px-8 py-4">Details</th>
              <th className="px-8 py-4">Transaction</th>
              <th className="px-8 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visibleData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-300 text-xs font-bold uppercase tracking-widest">
                  No activity recorded
                </td>
              </tr>
            ) : (
              visibleData.map((item) => {
                const isTronWithdrawal = type === "withdrawals" && !!item.wallet_address;
                const isPhoneWithdrawal = type === "withdrawals" && !!item.phone_number;
                const isRejected = item.status?.toLowerCase() === "rejected";
                const isPending = item.status?.toLowerCase() === "pending";
                const isSent = ["sent", "approved", "completed"].includes(item.status?.toLowerCase() || "");

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Date */}
                    <td className="px-8 py-4 text-xs font-medium text-gray-500">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Plan (Rewards) or Status (Withdrawals) */}
                    <td className="px-8 py-4">
                      {type === "rewards" ? (
                        <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase">
                          {item.investments?.plan_type || "N/A"}
                        </span>
                      ) : (
                        <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase ${getStatusColor(item.status)}`}>
                          {isRejected ? "Rejected" : isPending ? "Pending" : isSent ? "Completed" : item.status || "Unknown"}
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-4 text-xs text-gray-600">
                      {type === "rewards" ? (
                        <span className="italic">
                          Interest on {Number(item.investments?.initial_amount || 0).toLocaleString()} ShreeX investment
                        </span>
                      ) : isTronWithdrawal ? (
                        <code className="font-mono bg-gray-100 px-2 py-1 rounded text-[11px]">
                          {item.wallet_address?.slice(0, 8)}...{item.wallet_address?.slice(-6)}
                        </code>
                      ) : isPhoneWithdrawal ? (
                        <div className="flex items-center gap-2">
                          <span className="text-green-700 font-semibold text-xs">Mobile Money</span>
                          <code className="font-mono bg-emerald-100 px-2 py-1 rounded text-[11px] text-emerald-800">
                            {item.phone_number}
                          </code>
                        </div>
                      ) : (
                        <span className="italic text-gray-400">Internal transfer</span>
                      )}
                    </td>

                    <td className="px-8 py-4">
                      {type === "rewards" ? (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[9px] font-bold rounded-md uppercase">
                          Accrued (Off-Chain)
                        </span>
                      ) : isSent && item.tx_hash ? (
                        <a
                          href={`https://tronscan.org/#/transaction/${item.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline text-xs font-mono truncate block max-w-xs"
                        >
                          {item.tx_hash.slice(0, 10)}...{item.tx_hash.slice(-8)}
                        </a>
                      ) : isPending ? (
                        <span className="text-orange-600 text-xs font-medium italic">Pending processing</span>
                      ) : isRejected ? (
                        <span className="text-red-600 text-xs font-medium italic">Rejected & refunded</span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Manual / No tx</span>
                      )}
                    </td>

                    <td
                      className={`px-8 py-4 text-right font-black text-sm ${
                        type === "rewards" ? "text-green-600" : isRejected ? "text-gray-500" : "text-red-600"
                      }`}
                    >
                      {type === "rewards" ? "+" : isRejected ? "±" : "-"}
                      {Number(item.amount_added || item.amount || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      ShreeX
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="px-8 py-5 border-t border-gray-100 text-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 transition-shadow shadow-md active:scale-95"
          >
            Load More ({data.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

// Status badge colors
const getStatusColor = (status?: string) => {
  const s = status?.toLowerCase();
  if (s === "pending") return "bg-orange-50 text-orange-700";
  if (s === "rejected") return "bg-red-50 text-red-700";
  if (["sent", "approved", "completed"].includes(s || "")) return "bg-green-50 text-green-700";
  return "bg-gray-50 text-gray-600";
};