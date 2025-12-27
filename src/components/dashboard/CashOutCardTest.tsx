// components/CashOutCard.tsx
import React from "react";
import { useWithdrawalRequest } from "../../hooks/useWithdrawalRequest";

interface CashOutCardProps {
  currentBalance: number;
  onSuccess?: () => void;
}

const CashOutCardTest: React.FC<CashOutCardProps> = ({ currentBalance, onSuccess }) => {
  const {
    amount,
    setAmount,
    walletAddress,
    setWalletAddress,
    loading,
    requestWithdrawal,
  } = useWithdrawalRequest({ onSuccess });

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto md:p-8 my-10 border border-gray-100 font-sans">
      <h2 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
        Withdraw Tokens to USDT
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Balance: <strong>{currentBalance.toLocaleString()}</strong> Tokens
      </p>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to withdraw"
        className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl mb-4 focus:border-red-500 outline-none"
        min="1"
        max={currentBalance}
      />

      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Your Tron wallet (starts with T)"
        className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl mb-6 focus:border-red-500 outline-none"
      />

      <button
        onClick={requestWithdrawal}
        disabled={loading || !amount || Number(amount) > currentBalance || !walletAddress}
        className="w-full py-6 bg-linear-to-r from-red-600 to-pink-600 text-white text-xl font-bold rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed hover:from-red-700 hover:to-pink-700 transition-all"
      >
        {loading ? "Submitting Request..." : "Request Withdrawal"}
      </button>

      <p className="text-sm text-gray-500 text-center mt-6 bg-yellow-50 py-3 rounded-xl border border-yellow-200">
        ⏱️ Requests are processed manually within <strong>24 working hours</strong>
      </p>
    </div>
  );
};

export default CashOutCardTest;