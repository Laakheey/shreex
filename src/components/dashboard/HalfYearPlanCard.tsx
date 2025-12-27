import React, { useState } from "react";
import toast from "react-hot-toast";
import { useInvest } from "../../hooks/useInvestments";

interface PlanCardProps {
  currentBalance: number;
  mutate: () => Promise<void>;
  onInvestmentSuccess?: () => Promise<void>;
}

const HalfYearPlanCard: React.FC<PlanCardProps> = ({
  currentBalance,
  mutate,
  onInvestmentSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const { invest, loading } = useInvest();

  const handleInvest = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num < 10) {
      toast.error("Minimum investment is 10 USDT");
      return;
    }
    if (num > currentBalance) {
      toast.error("Insufficient balance");
      return;
    }

    // Matches the "half-yearly" type in your useInvest hook
    await invest(num, "half-yearly", currentBalance, mutate, onInvestmentSuccess);
    setAmount("");
  };

  const handleMax = () => {
    if (currentBalance >= 10) setAmount(currentBalance.toString());
    else toast.error("Balance is below 10 USDT");
  };

  return (
    <div className="bg-linear-to-br from-purple-600 to-indigo-700 text-white rounded-3xl shadow-xl p-8 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300">
      <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-5 py-2 rounded-bl-2xl font-black text-sm">
        HIGH YIELD
      </div>
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold">6-Month Growth</h3>
          <p className="opacity-80">Fixed Term Strategy</p>
        </div>
        <div className="mb-8">
          <span className="text-6xl font-black">1.75x</span>
          <p className="mt-2 opacity-70 italic text-sm">
            Returns on maturity
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-sm mb-2 opacity-90">
            <span>Investment Amount</span>
            <span>Balance: {(currentBalance ?? 0).toLocaleString()}</span>
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Min. 10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white outline-none focus:border-white/50 text-xl font-semibold"
            />
            <button onClick={handleMax} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-white text-purple-700 px-2 py-1 rounded">
              MAX
            </button>
          </div>
          <p className="text-xs mt-2 text-green-100 opacity-70">
            Min investment: 10 USDT
          </p>
          <button
            onClick={handleInvest}
            disabled={loading || !amount || parseFloat(amount) < 10}
            className="w-full py-5 bg-white text-purple-700 text-xl font-extrabold rounded-2xl shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            {loading ? "Locking..." : "Lock for 6 Months"}
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-xs opacity-60 italic">
        Locked for 180 days. Capital + Profit released at term end.
      </p>
    </div>
  );
};

export default HalfYearPlanCard;