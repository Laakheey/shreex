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
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-225 text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedIds.length === pending.length && pending.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                User Details
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                Recipient
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                Request Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pending.map((w) => {
              const isTron = !!w.wallet_address;
              const isPhone = !!w.phone_number;

              return (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedIds.includes(w.id)}
                      onChange={() => toggleSelect(w.id)}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {w.user_name || "Anonymous User"}
                      </span>
                      <span className="text-xs text-gray-500">{w.user_email}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-900">{w.amount}</span>
                      <span className="text-xs font-medium text-gray-500">USDT</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {/* Method Label */}
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        {w.withdrawal_method}
                      </span>

                      {isTron ? (
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-mono border border-gray-300">
                            {w.wallet_address.slice(0, 8)}...{w.wallet_address.slice(-6)}
                          </code>
                          <a
                            href={`https://tronscan.org/#/address/${w.wallet_address}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            <ExternalLink size={15} />
                          </a>
                        </div>
                      ) : isPhone ? (
                        <div className="flex items-center gap-2">
                          <code className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-mono border border-emerald-300">
                            {w.phone_number}
                          </code>
                          {/* <span className="text-xs text-gray-500 italic">Manual payout</span> */}
                        </div>
                      ) : (
                        <span className="text-xs text-red-500">Missing recipient</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {new Date(w.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => processWithdrawal(w.id, "approved")}
                        disabled={isTron && !selectedWallet}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 ${
                          isTron
                            ? selectedWallet
                              ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {isTron ? "Send USDT" : "Mark as Sent"}
                      </button>

                      <button
                        onClick={() => processWithdrawal(w.id, "rejected")}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                        title="Reject & Refund"
                      >
                        <XCircle size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Scroll Hint */}
      <div className="lg:hidden bg-linear-to-r from-indigo-50 to-purple-50 border-t border-gray-200 py-3 px-4 text-center">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
          ← Scroll horizontally to view actions →
        </span>
      </div>
    </div>
  );
};