import React, { useState } from "react";
import WithdrawalModal from "./WithdrawalModal";
import { useWithdrawal } from "../../hooks/useWithdrawal";
import { 
  getWithdrawalWindow, 
  formatInvestmentDate,
  getDaysSinceStart 
} from "../../utils/investmentWindows";

interface ActiveInvestmentsCardProps {
  investments: any[];
  loading: boolean;
  onWithdrawSuccess: () => Promise<void>;
}

const ActiveInvestmentsCard: React.FC<ActiveInvestmentsCardProps> = ({
  investments,
  loading,
  onWithdrawSuccess,
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { executeWithdrawal, loading: withdrawing } = useWithdrawal(onWithdrawSuccess);

  const handleWithdrawClick = (investment: any) => {
    const window = getWithdrawalWindow(investment.plan_type, investment.start_date);
    
    if (!window.isOpen) return;

    setSelectedInvestment(investment);
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdraw = async () => {
    const success = await executeWithdrawal(selectedInvestment, withdrawAmount);
    if (success) {
      setShowWithdrawModal(false);
      setSelectedInvestment(null);
      setWithdrawAmount("");
    }
  };

  const handleCloseModal = () => {
    setShowWithdrawModal(false);
    setSelectedInvestment(null);
    setWithdrawAmount("");
  };

  // Helper to get Plan-specific UI details
  const getPlanDetails = (type: string) => {
    switch (type) {
      case 'monthly':
        return { 
          color: 'bg-green-600', 
          label: 'Monthly (10%)', 
          sub: 'Monthly Payout' 
        };
      case 'half-yearly': // Corrected: This is the 6-month plan
        return { 
          color: 'bg-purple-600', 
          label: '6 Months (1.75x)', 
          sub: 'Fixed Term' 
        };
      case 'yearly': // Corrected: This is the 12-month plan
        return { 
          color: 'bg-indigo-600', 
          label: 'Yearly (3x)', 
          sub: 'High Yield' 
        };
      default:
        return { 
          color: 'bg-gray-600', 
          label: type, 
          sub: 'Investment' 
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No active investments</div>
        <p className="text-gray-500 text-sm">Start investing to see your portfolio here</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((investment) => {
            const window = getWithdrawalWindow(investment.plan_type, investment.start_date);
            const plan = getPlanDetails(investment.plan_type);
            const daysSinceStart = getDaysSinceStart(investment.start_date);

            return (
              <div
                key={investment.id}
                className="bg-linear-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl p-6 border border-indigo-100 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`${plan.color} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                    {plan.label}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    window.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {window.isOpen ? '🔓 Available' : '🔒 Locked'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-500 text-xs mb-1">{plan.sub}</p>
                  <p className="text-3xl font-black text-gray-900">
                    {Number(investment.amount_tokens).toLocaleString()}
                    <span className="text-xs text-gray-400 ml-2 font-medium">USDT</span>
                  </p>
                </div>

                <div className="mb-6 p-4 bg-white/60 rounded-xl border border-white/50">
                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                    {window.message}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200/50 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Started</p>
                      <p className="text-xs text-gray-700 font-semibold">{formatInvestmentDate(investment.start_date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Age</p>
                      <p className="text-xs text-gray-700 font-semibold">{daysSinceStart}d</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleWithdrawClick(investment)}
                  disabled={!window.isOpen}
                  className={`w-full py-3.5 font-bold rounded-xl transition-all active:scale-95 ${
                    window.isOpen
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {window.isOpen ? 'Withdraw Funds' : `Unlocks in ${window.daysUntilWindow} days`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showWithdrawModal && (
        <WithdrawalModal
          investment={selectedInvestment}
          amount={withdrawAmount}
          setAmount={setWithdrawAmount}
          onClose={handleCloseModal}
          onConfirm={handleConfirmWithdraw}
          loading={withdrawing}
        />
      )}
    </>
  );
};

export default ActiveInvestmentsCard;