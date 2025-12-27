// components/admin/withdrawal/WithdrawalBulkActions.tsx
import { Check, X } from "lucide-react";

interface Props {
  selectedCount: number;
  hasSelectedWallet: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export const WithdrawalBulkActions: React.FC<Props> = ({ selectedCount, hasSelectedWallet, onApprove, onReject }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-6 flex gap-3">
      <button
        onClick={onApprove}
        disabled={!hasSelectedWallet}
        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-60 flex items-center gap-2"
      >
        <Check size={18} /> Approve Selected ({selectedCount})
      </button>
      <button
        onClick={onReject}
        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center gap-2"
      >
        <X size={18} /> Reject Selected
      </button>
    </div>
  );
};