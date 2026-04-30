"use client";

import { useState } from "react";
import { Calendar, ArrowDownCircle } from "lucide-react";
import toast from "react-hot-toast";
import { withdrawFromInvestment } from "@/lib/actions/investments";
import {
  getMonthlyWithdrawalWindow,
  getFixedWithdrawalWindow,
  formatInvestmentDate,
} from "@/lib/utils/investment-windows";

interface Investment {
  id: number;
  userId: string;
  amountTokens: number;
  initialAmount: number;
  planType: string;
  status: string;
  startDate: string | null;
  createdAt: string;
}

interface Props {
  investments: Investment[];
  onWithdrawSuccess: () => Promise<void>;
  isUserLeader: boolean;
}

export function ActiveInvestmentsCard({
  investments,
  onWithdrawSuccess,
  isUserLeader,
}: Props) {
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = async (inv: Investment) => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0 || amount > inv.amountTokens) {
      toast.error("Invalid withdrawal amount");
      return;
    }

    setWithdrawingId(inv.id);
    const result = await withdrawFromInvestment(
      inv.id,
      amount,
      inv.planType,
      inv.startDate || inv.createdAt.split("T")[0]
    );

    if (result.success) {
      toast.success(result.message!);
      setWithdrawAmount("");
      setWithdrawingId(null);
      await onWithdrawSuccess();
    } else {
      toast.error(result.error!);
      setWithdrawingId(null);
    }
  };

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No active investments yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Choose a plan above to start earning
        </p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">
        Active Investments
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {investments.map((inv) => {
          const window =
            inv.planType === "monthly"
              ? getMonthlyWithdrawalWindow(
                  inv.startDate || inv.createdAt
                )
              : getFixedWithdrawalWindow(
                  inv.startDate || inv.createdAt
                );

          const canWithdraw = window.isOpen || isUserLeader;

          return (
            <div
              key={inv.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold capitalize">
                    {inv.planType}
                  </span>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {inv.amountTokens.toLocaleString()} tokens
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                Started:{" "}
                {formatInvestmentDate(inv.startDate || inv.createdAt)}
              </p>
              <p
                className={`text-sm mb-4 ${window.isOpen ? "text-green-600 font-semibold" : "text-gray-500"}`}
              >
                {window.message}
              </p>

              {canWithdraw && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={withdrawingId === inv.id ? withdrawAmount : ""}
                    onChange={(e) => {
                      setWithdrawingId(inv.id);
                      setWithdrawAmount(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleWithdraw(inv)}
                    disabled={withdrawingId === inv.id && !withdrawAmount}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    <ArrowDownCircle className="h-4 w-4" />
                    Withdraw
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
