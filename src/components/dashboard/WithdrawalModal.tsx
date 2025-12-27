import React from "react";

interface WithdrawalModalProps {
  investment: any;
  amount: string;
  setAmount: (val: string) => void;
  onClose: () => void;
  onConfirm: () => Promise<void | boolean>;
  loading: boolean;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  investment,
  amount,
  setAmount,
  onClose,
  onConfirm,
  loading,
}) => {
  if (!investment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Withdraw Funds</h2>
        <p className="text-gray-500 text-sm mb-6">
          Plan: <span className="font-bold text-gray-800 uppercase">{investment.plan_type}</span>
        </p>

        {/* Balance Display */}
        <div className="bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-tight">
            Available for withdrawal
          </p>
          <p className="text-3xl font-black text-indigo-600">
            {investment.amount_tokens.toLocaleString()} <span className="text-sm text-gray-400">Tokens</span>
          </p>
        </div>

        {/* Input Field */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            Amount to Withdraw
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition text-xl font-bold text-gray-900"
            />
            <button 
              onClick={() => setAmount(investment.amount_tokens.toString())}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl text-xs font-black hover:bg-indigo-100 transition"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || !amount}
            className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing
              </div>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;