import { useState } from "react";
import toast from "react-hot-toast";
import { useInvest } from "../../hooks/useInvestments";

interface MonthlyPlanCardProps {
  currentBalance: number;
  mutate: () => Promise<void>;
  onInvestmentSuccess?: () => Promise<void>;
}

const MonthlyPlanCard: React.FC<MonthlyPlanCardProps> = ({
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

    await invest(num, "monthly", currentBalance, mutate, onInvestmentSuccess);
    setAmount("");
  };

  const handleMax = () => {
    if (currentBalance >= 10) {
      setAmount(currentBalance.toString());
    } else {
      toast.error("Balance is below the minimum 10 USDT");
    }
  };

  return (
    <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold">Monthly Growth</h3>
          <p className="text-green-100 opacity-80">Simple Interest Plan</p>
        </div>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
          Active
        </span>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black">10%</span>
          <span className="text-xl font-bold opacity-90">/ month</span>
        </div>
        <p className="mt-2 text-green-50 opacity-70">
          Rewards added daily at 12:00 AM NY Time
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-white text-green-600 px-2 py-1 rounded hover:bg-green-50 transition"
            >
              MAX
            </button>
          </div>
          <p className="text-xs mt-2 text-green-100 opacity-70">
            Min investment: 10 USDT
          </p>
        </div>

        <button
          onClick={handleInvest}
          disabled={loading || !amount || parseFloat(amount) < 10}
          className="w-full py-5 bg-white text-green-700 text-xl font-extrabold rounded-2xl shadow-lg hover:bg-green-50 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            "Invest Now"
          )}
        </button>
      </div>

      <p className="text-center text-xs mt-6 opacity-60">
        * 10% is calculated on initial deposit. Non-compounding.
      </p>
    </div>
  );
};

export default MonthlyPlanCard;