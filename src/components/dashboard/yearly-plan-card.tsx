"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import toast from "react-hot-toast";
import { invest } from "@/lib/actions/investments";

interface Props {
  currentBalance: number;
  onSuccess: () => Promise<void>;
}

export function YearlyPlanCard({ currentBalance, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvest = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0 || num > currentBalance) {
      toast.error("Invalid amount");
      return;
    }

    setLoading(true);
    const result = await invest(num, "yearly", currentBalance);
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
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:shadow-xl transition">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-purple-100 p-3 rounded-xl">
          <Gem className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">12-Month Lock-In</h3>
          <p className="text-sm text-gray-500">3x return</p>
        </div>
      </div>

      <input
        type="number"
        placeholder="Amount to invest"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />

      <button
        onClick={handleInvest}
        disabled={loading}
        className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Invest in Yearly Plan"}
      </button>
    </div>
  );
}
