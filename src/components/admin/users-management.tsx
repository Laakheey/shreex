"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getUsers,
  updateUserBalance,
  toggleUserActive,
  getUserTransactions,
} from "@/lib/actions/admin";

export function UsersManagementView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [txModal, setTxModal] = useState<{ userId: string; data: any } | null>(
    null
  );

  const fetchUsers = useCallback(async (p: number) => {
    setLoading(true);
    const result = await getUsers(p);
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  const handleUpdateBalance = async (userId: string) => {
    const newBal = parseFloat(editBalance);
    if (isNaN(newBal) || newBal < 0) {
      toast.error("Invalid balance");
      return;
    }

    const result = await updateUserBalance(userId, newBal);
    if (result.success) {
      toast.success(`Balance updated: ${result.previousBalance} → ${result.newBalance}`);
      setEditingUser(null);
      setEditBalance("");
      fetchUsers(page);
    } else {
      toast.error(result.error || "Update failed");
    }
  };

  const handleToggle = async (userId: string, currentActive: boolean) => {
    const result = await toggleUserActive(userId, !currentActive);
    if (result.success) {
      toast.success(`User ${currentActive ? "deactivated" : "activated"}`);
      fetchUsers(page);
    }
  };

  const viewTransactions = async (userId: string) => {
    const result = await getUserTransactions(userId);
    setTxModal({ userId, data: result });
  };

  const filtered = data?.users?.filter(
    (u: any) =>
      !search ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !data) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm"
          />
        </div>
        <span className="text-sm text-gray-500">{data?.totalUsers} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-2 font-medium text-gray-500">
                User
              </th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">
                Balance
              </th>
              <th className="text-center py-3 px-2 font-medium text-gray-500">
                Status
              </th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((user: any) => (
              <tr
                key={user.id}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="py-3 px-2">
                  <p className="font-medium text-gray-900">
                    {[user.firstName, user.lastName].filter(Boolean).join(" ") || "No Name"}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[200px]">
                    {user.email}
                  </p>
                </td>
                <td className="py-3 px-2 text-right">
                  {editingUser === user.id ? (
                    <div className="flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={editBalance}
                        onChange={(e) => setEditBalance(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateBalance(user.id)}
                        className="text-green-600 text-xs font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="text-gray-400 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingUser(user.id);
                        setEditBalance(String(Number(user.tokenBalance)));
                      }}
                      className="font-semibold text-gray-900 hover:text-indigo-600 transition"
                    >
                      {Number(user.tokenBalance).toLocaleString()}
                    </button>
                  )}
                </td>
                <td className="py-3 px-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => viewTransactions(user.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                      title="View Transactions"
                    >
                      <Eye className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleToggle(user.id, user.isActive)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                      title={user.isActive ? "Deactivate" : "Activate"}
                    >
                      {user.isActive ? (
                        <Ban className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg disabled:opacity-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {txModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">User Transactions</h3>
              <button
                onClick={() => setTxModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                Close
              </button>
            </div>
            {txModal.data.transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No transactions found
              </p>
            ) : (
              <div className="space-y-3">
                {txModal.data.transactions.map((tx: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-gray-50 text-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium capitalize">
                        {tx.type?.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {Number(tx.amount).toLocaleString()}
                      </p>
                      {tx.status && (
                        <span className="text-xs capitalize text-gray-500">
                          {tx.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
