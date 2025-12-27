// components/admin/UserWithdrawal.tsx
import React from "react";
import { useAdminWithdrawals } from "../../hooks/useAdminWithdrawals";
import { PayoutWalletsManager } from "./PayoutWalletsManager";
import { WithdrawalWalletSelector } from "./WithdrawalWalletSelector";
import { WithdrawalBulkActions } from "./WithdrawalBulkActions";
import { WithdrawalTable } from "./WithdrawalTable";
import { Loading } from "../../components";
import { AlertCircle } from "lucide-react";

const UserWithdrawal: React.FC = () => {
  const {
    withdrawals,
    loading,
    wallets,
    selectedWallet,
    setSelectedWallet,
    processWithdrawal,
    bulkApprove,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    fetchData,
  } = useAdminWithdrawals();

  const pending = withdrawals.filter((w) => w.status === "pending");

  // Fix: Must return the Loading component
  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Withdrawal Requests
          </h2>
          <p className="text-gray-500 text-sm">Review and process pending USDT payouts.</p>
        </div>
        
        {pending.length > 0 && !selectedWallet && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-xs font-medium animate-pulse">
            <AlertCircle size={14} />
            Select a payout wallet to enable "Send" buttons
          </div>
        )}
      </div>

      <PayoutWalletsManager wallets={wallets} onRefresh={fetchData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WithdrawalWalletSelector
            wallets={wallets}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
            hasPending={pending.length > 0}
          />
        </div>
        <div className="lg:col-span-1 flex items-end">
          <WithdrawalBulkActions
            selectedCount={selectedIds.length}
            hasSelectedWallet={!!selectedWallet}
            onApprove={() => bulkApprove("approved")}
            onReject={() => bulkApprove("rejected")}
          />
        </div>
      </div>

      <WithdrawalTable
        pending={pending}
        selectedIds={selectedIds}
        selectedWallet={selectedWallet}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAll}
        processWithdrawal={processWithdrawal}
      />
    </div>
  );
};

export default UserWithdrawal;