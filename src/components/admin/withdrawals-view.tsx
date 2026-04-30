"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Check,
  X,
  AlertTriangle,
  Filter,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getWithdrawals,
  getPayoutWallets,
  processWithdrawal,
  bulkProcess,
} from "@/lib/actions/admin-withdrawals";

export function WithdrawalsView() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [processing, setProcessing] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [wData, wlData] = await Promise.all([
      getWithdrawals(),
      getPayoutWallets(),
    ]);
    setWithdrawals(wData);
    setWallets(wlData);
    if (wlData.length > 0 && !selectedWallet) {
      setSelectedWallet(String(wlData[0].id));
    }
    setLoading(false);
  }, [selectedWallet]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered =
    filter === "all" ? withdrawals : withdrawals.filter((w) => w.status === filter);

  const handleProcess = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    setProcessing(id);
    const result = await processWithdrawal(id, status, selectedWallet);
    if (result.success) {
      toast.success(result.message!);
      fetchData();
    } else {
      toast.error(result.error!);
    }
    setProcessing(null);
  };

  const handleBulk = async (status: "approved" | "rejected") => {
    if (selected.size === 0) {
      toast.error("No withdrawals selected");
      return;
    }
    const results = await bulkProcess(Array.from(selected), status, selectedWallet);
    const successCount = results.filter((r) => r.success).length;
    toast.success(`${successCount} of ${selected.size} processed`);
    setSelected(new Set());
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-gray-400" />
          {["all", "pending", "approved", "rejected", "sent"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
                filter === f
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {wallets.length > 0 && (
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-gray-400" />
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              {wallets.map((w) => (
                <option key={w.id} value={String(w.id)}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selected.size > 0 && (
        <div className="flex gap-3 bg-gray-50 p-3 rounded-xl items-center">
          <span className="text-sm text-gray-600">
            {selected.size} selected
          </span>
          <button
            onClick={() => handleBulk("approved")}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold"
          >
            Approve All
          </button>
          <button
            onClick={() => handleBulk("rejected")}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold"
          >
            Reject All
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 px-2 w-8">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? new Set(
                            filtered
                              .filter((w) => w.status === "pending")
                              .map((w) => w.id)
                          )
                        : new Set()
                    )
                  }
                />
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">
                User
              </th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">
                Amount
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">
                Method
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
            {filtered.map((w) => (
              <tr
                key={w.id}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="py-3 px-2">
                  {w.status === "pending" && (
                    <input
                      type="checkbox"
                      checked={selected.has(w.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(w.id); else next.delete(w.id);
                        setSelected(next);
                      }}
                    />
                  )}
                </td>
                <td className="py-3 px-2">
                  <p className="font-medium text-gray-900">{w.user_name}</p>
                  <p className="text-xs text-gray-400">{w.user_email}</p>
                </td>
                <td className="py-3 px-2 text-right font-bold">
                  {w.amount.toLocaleString()}
                </td>
                <td className="py-3 px-2">
                  <span className="text-xs text-gray-500">
                    {w.withdrawal_method}
                  </span>
                  <p className="text-xs font-mono text-gray-400 truncate max-w-[120px]">
                    {w.walletAddress || w.phoneNumber}
                  </p>
                </td>
                <td className="py-3 px-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                      w.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : w.status === "approved" || w.status === "sent"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {w.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  {w.status === "pending" && (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleProcess(w.id, "approved")}
                        disabled={processing === w.id}
                        className="p-1.5 rounded-lg hover:bg-green-50 transition"
                        title="Approve"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleProcess(w.id, "rejected")}
                        disabled={processing === w.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition"
                        title="Reject"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No {filter === "all" ? "" : filter} withdrawals found</p>
        </div>
      )}
    </div>
  );
}
