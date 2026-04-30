"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { invest } from "@/lib/actions/investments";

interface Props {
  currentBalance: number;
  onSuccess: () => Promise<void>;
}

export function MonthlyPlanCard({ currentBalance, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvest = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0 || num > currentBalance) {
      toast.error("Invalid amount");
      return;
    }

    setLoading(true);
    const result = await invest(num, "monthly", currentBalance);
    setLoading(false);

    if (result.success) {
      toast.success(result.message!);
      setAmount("");
      await onSuccess();
    } else {
      toast.error(result.error!);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-green-100 p-3 rounded-xl">
          <TrendingUp className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Monthly Growth</h3>
          <p className="text-sm text-gray-500">10% monthly returns</p>
        </div>
      </div>

      <input
        type="number"
        placeholder="Amount to invest"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <button
        onClick={handleInvest}
        disabled={loading}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Invest in Monthly Plan"}
      </button>
    </div>
  );
}
