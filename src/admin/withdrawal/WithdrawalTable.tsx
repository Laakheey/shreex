// components/admin/withdrawal/WithdrawalTable.tsx
import React from "react";
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";

interface Props {
  pending: any[];
  selectedIds: number[];
  selectedWallet: string;
  toggleSelect: (id: number) => void;
  toggleSelectAll: () => void;
  processWithdrawal: (id: number, status: "approved" | "rejected") => void;
}

export const WithdrawalTable: React.FC<Props> = ({
  pending,
  selectedIds,
  selectedWallet,
  toggleSelect,
  toggleSelectAll,
  processWithdrawal,
}) => {
  if (pending.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-500" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
        <p className="text-gray-500">No pending withdrawal requests found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Container for horizontal scrolling on mobile */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-225 text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedIds.length === pending.length && pending.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">User Details</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Recipient Wallet</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Request Date</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pending.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedIds.includes(w.id)} 
                    onChange={() => toggleSelect(w.id)} 
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{w.user_name || "Anonymous User"}</span>
                    <span className="text-xs text-gray-500">{w.user_email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-gray-900">{w.amount}</span>
                    <span className="text-[10px] font-bold text-gray-400">USDT</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 group/wallet">
                    <code className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[11px] font-mono border border-gray-200">
                      {w.wallet_address.slice(0, 8)}...{w.wallet_address.slice(-8)}
                    </code>
                    <a 
                      href={`https://tronscan.org/#/address/${w.wallet_address}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-gray-300 hover:text-indigo-500 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    {new Date(w.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => processWithdrawal(w.id, "approved")}
                      disabled={!selectedWallet}
                      className="flex-1 md:flex-none px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black disabled:opacity-30 disabled:grayscale transition-all shadow-sm active:scale-95"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => processWithdrawal(w.id, "rejected")}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                      title="Reject Request"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Indicator */}
      <div className="lg:hidden bg-gray-50 border-t border-gray-100 py-2 px-4 flex justify-center items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-gray-300 animate-ping" />
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Scroll Right to view actions
        </span>
      </div>
    </div>
  );
};