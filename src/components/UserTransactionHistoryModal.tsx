// src/components/UserTransactionHistoryModal.tsx

import React from "react";
import { useUserHistory } from "../hooks/useUserHistory";

interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface Props {
  user: User | null;
  onClose: () => void;
}

const UserTransactionHistoryModal: React.FC<Props> = ({ user, onClose }) => {
  const {
    items,
    loading,
    filter,
    setFilter,
    searchHash,
    setSearchHash,
    refetch,
  } = useUserHistory(user?.id || null);

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            History — {user.first_name || user.email || "User"} ({user.id.slice(-8)})
          </h2>
          <button onClick={onClose} className="text-3xl text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-3 border rounded-lg"
            >
              <option value="all">All Transactions & Activity</option>
              <option value="token_purchases">Token Purchases Only</option>
              <option value="investments">Investments Only</option>
            </select>

            <input
              type="text"
              placeholder="Search by transaction hash..."
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg"
            />

            <button
              onClick={refetch}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No records found</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Plan/Description</th>
                  <th className="px-6 py-4 text-left">Tx Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.source === "token_request" ? "bg-blue-100 text-blue-800" :
                        item.source === "investment" ? "bg-indigo-100 text-indigo-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {item.type.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-green-600">
                      +{item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {item.status ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "approved" ? "bg-green-100 text-green-800" :
                          item.status === "conflicted" ? "bg-orange-100 text-orange-800" :
                          item.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {item.status}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.plan_type ? `Plan: ${item.plan_type}` : item.description || "—"}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {item.tx_hash ? (
                        <a
                          href={`https://nile.tronscan.org/#/transaction/${item.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          {item.tx_hash.slice(0, 12)}...
                        </a>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTransactionHistoryModal;