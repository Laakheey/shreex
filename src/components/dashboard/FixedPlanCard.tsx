import React, { useState } from "react";
import toast from "react-hot-toast";
import { useInvest } from "../../hooks/useInvestments";

interface YearlyPlanCardProps {
  currentBalance: number;
  mutate: () => Promise<void>;
  onInvestmentSuccess?: () => Promise<void>;
}

const YearlyPlanCard: React.FC<YearlyPlanCardProps> = ({
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

    // Using "yearly" to match your updated hook and DB constraints
    await invest(num, "yearly", currentBalance, mutate, onInvestmentSuccess);
    setAmount("");
  };

  const handleMax = () => {
    if (currentBalance >= 10) {
      setAmount(currentBalance.toString());
    } else {
      toast.error("Balance is below the minimum 10 USDT");
    }
  };

  const displayPayout = () => {
    const num = parseFloat(amount);
    if (!isNaN(num) && num >= 10) {
      return (num * 3).toLocaleString(); // 3x returns for 12 months
    }
    return "0";
  };

  return (
    <div className="bg-linear-to-br from-indigo-600 to-indigo-800 text-white rounded-3xl shadow-xl p-8 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300">
      <div className="absolute top-0 right-0 bg-amber-400 text-indigo-900 px-5 py-2 rounded-bl-2xl font-black text-sm tracking-tighter">
        BEST VALUE
      </div>

      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold">12-Month Fortune</h3>
          <p className="text-indigo-100 opacity-80">Full Maturity Plan</p>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black">3x</span>
            <span className="text-xl font-bold opacity-90">Returns</span>
          </div>
          <p className="mt-2 text-indigo-50 opacity-70 italic text-sm">
            Total payout: <strong>{displayPayout()}</strong> USDT on maturity
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2 opacity-90">
              <span>Investment Amount</span>
              <span>Balance: {(currentBalance ?? 0).toLocaleString()}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="Min. 10 USDT"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 outline-none focus:border-white/50 focus:bg-white/20 transition text-xl font-semibold"
              />
              <button
                onClick={handleMax}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-white text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition"
              >
                MAX
              </button>
            </div>
            <p className="text-xs mt-2 text-indigo-100 opacity-70">
              Minimum: 10 USDT
            </p>
          </div>

          <button
            onClick={handleInvest}
            disabled={loading || !amount || parseFloat(amount) < 10}
            className="w-full py-5 bg-white text-indigo-700 text-xl font-extrabold rounded-2xl shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                Locking...
              </div>
            ) : "Lock for 12 Months"}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs opacity-60">
        Funds are locked for 365 days. Early withdrawal is not permitted.
      </p>
    </div>
  );
};

export default YearlyPlanCard;