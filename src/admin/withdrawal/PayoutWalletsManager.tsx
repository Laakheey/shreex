// components/admin/withdrawal/PayoutWalletsManager.tsx
import React from "react";
import { Plus, Wallet, Loader2, Check } from "lucide-react";
import { usePayoutWallets } from "../../hooks/usePayoutWallets";

interface PayoutWalletsManagerProps {
  wallets: any[];
  onRefresh: () => void;
}

export const PayoutWalletsManager: React.FC<PayoutWalletsManagerProps> = ({ wallets, onRefresh }) => {
  const {
    showForm,
    setShowForm,
    name,
    setName,
    address,
    setAddress,
    privateKey,
    setPrivateKey,
    loading,
    addWallet,
    resetForm,
  } = usePayoutWallets({ onRefresh });

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wallet className="text-indigo-600" size={28} />
          <h3 className="text-2xl font-semibold">Payout Wallets</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Wallet
        </button>
      </div>

      {/* Add Wallet Form */}
      {showForm && (
        <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-200 mb-6">
          <h4 className="font-semibold mb-4 text-indigo-900">Add New Payout Wallet</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Wallet Name (e.g. Main Hot Wallet)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Tron Address (starts with T)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <input
              type="password"
              placeholder="Private Key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={addWallet}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-60 flex items-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              Save Wallet
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Wallets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {wallets.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10 text-lg">
            No payout wallets configured yet. Click "Add Wallet" to get started.
          </p>
        ) : (
          wallets.map((w) => (
            <div
              key={w.id}
              className="p-5 bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow"
            >
              <h4 className="font-bold text-indigo-900 text-lg">{w.name}</h4>
              <code className="text-xs text-gray-700 block mt-2 break-all">
                {w.address.slice(0, 10)}...{w.address.slice(-8)}
              </code>
              <p className="text-sm text-gray-600 mt-3">
                Balance: <span className="font-semibold">{w.balance || 0} USDT</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};