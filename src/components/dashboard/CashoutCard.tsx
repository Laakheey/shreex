// components/CashOutCard.tsx
import React from "react";
import { useCashOut } from "../../hooks/useCashOut";

interface CashOutCardProps {
  currentBalance: number;
  onSuccess?: () => void;
}

const CashOutCard: React.FC<CashOutCardProps> = ({
  currentBalance,
  onSuccess,
}) => {
  const {
    amount,
    setAmount,
    walletAddress,
    setWalletAddress,
    loading,
    cashOut,
  } = useCashOut({ onSuccess });

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto md:p-8 my-10 border border-gray-100 font-sans">
      <h2 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
        Token to USDT
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Balance: <strong>{currentBalance}</strong> Tokens
      </p>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to cash out"
        className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl mb-4 focus:border-red-500"
        min="1"
        max={currentBalance}
      />

      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Your Tron wallet address (T...)"
        className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl mb-6 focus:border-red-500"
      />

      <button
        onClick={cashOut}
        disabled={
          loading ||
          !amount ||
          Number(amount) > currentBalance ||
          !walletAddress
        }
        className="w-full py-6 bg-linear-to-r from-red-600 to-pink-600 text-white text-xl font-bold rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Cash Out to USDT"}
      </button>

      <p className="text-sm text-gray-500 text-center mt-4">
        1 Token = 1 USDT • Instant payout
      </p>
    </div>
  );
};

export default CashOutCard;
