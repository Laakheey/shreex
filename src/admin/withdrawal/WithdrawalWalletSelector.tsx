// components/admin/withdrawal/WithdrawalWalletSelector.tsx
import { Wallet } from "lucide-react";

interface Props {
  wallets: any[];
  selectedWallet: string;
  setSelectedWallet: (id: string) => void;
  hasPending: boolean;
}

export const WithdrawalWalletSelector: React.FC<Props> = ({ wallets, selectedWallet, setSelectedWallet, hasPending }) => {
  return (
    <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 border">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="text-indigo-600" size={24} />
        <h3 className="text-xl font-semibold">Send From Wallet</h3>
      </div>
      <select
        value={selectedWallet}
        onChange={(e) => setSelectedWallet(e.target.value)}
        className="w-full max-w-md px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        <option value="">Select wallet to send from...</option>
        {wallets.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name} ({w.address.slice(0,8)}...{w.address.slice(-6)})
          </option>
        ))}
      </select>
      {!selectedWallet && hasPending && (
        <p className="text-sm text-orange-600 mt-3">Select a wallet before approving</p>
      )}
    </div>
  );
};