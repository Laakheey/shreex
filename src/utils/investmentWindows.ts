import {
  addYears,
  addDays,
  differenceInDays,
  format,
  startOfDay,
  isSameDay,
} from 'date-fns';

export interface WithdrawalWindow {
  isOpen: boolean;
  nextWindowDate: Date | null;
  daysUntilWindow: number;
  message: string;
}

export function getMonthlyWithdrawalWindow(startDate: string | Date): WithdrawalWindow {
  const start = startOfDay(new Date(startDate));
  const today = startOfDay(new Date());
  
  const daysSinceStart = differenceInDays(today, start);
  
  const isWithdrawalDay = daysSinceStart > 0 && daysSinceStart % 15 === 0;
  
  let nextWindowDate: Date;
  let daysUntilWindow: number;
  
  if (isWithdrawalDay) {
    nextWindowDate = today;
    daysUntilWindow = 0;
  } else {
    const daysIntoCurrentCycle = daysSinceStart % 15;
    daysUntilWindow = 15 - daysIntoCurrentCycle;
    nextWindowDate = addDays(today, daysUntilWindow);
  }
  
  const message = isWithdrawalDay 
    ? "Withdrawal window is OPEN (Expires at midnight)"
    : `Next window opens on ${format(nextWindowDate, 'MMM d')} (${daysUntilWindow} ${daysUntilWindow === 1 ? 'day' : 'days'})`;
  
  return {
    isOpen: isWithdrawalDay,
    nextWindowDate,
    daysUntilWindow,
    message
  };
}

export function getFixedWithdrawalWindow(startDate: string | Date): WithdrawalWindow {
  const start = startOfDay(new Date(startDate));
  const today = startOfDay(new Date());
  
  const unlockDate = addYears(start, 1);
  
  const isOpen = today >= unlockDate || isSameDay(today, unlockDate);
  
  const daysUntilUnlock = differenceInDays(unlockDate, today);
  
  const message = isOpen
    ? "Investment matured! You can withdraw 3x your deposit"
    : `Locked for ${daysUntilUnlock} more ${daysUntilUnlock === 1 ? 'day' : 'days'} (Unlocks on ${format(unlockDate, 'MMM d, yyyy')})`;
  
  return {
    isOpen,
    nextWindowDate: unlockDate,
    daysUntilWindow: Math.max(0, daysUntilUnlock),
    message
  };
}

export function getWithdrawalWindow(planType: 'monthly' | 'fixed', startDate: string | Date): WithdrawalWindow {
  if (planType === 'monthly') {
    return getMonthlyWithdrawalWindow(startDate);
  } else {
    return getFixedWithdrawalWindow(startDate);
  }
}

export function calculateFixedPlanPayout(initialAmount: number): number {
  return initialAmount * 3;
}

export function formatInvestmentDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function getDaysSinceStart(startDate: string | Date): number {
  const start = startOfDay(new Date(startDate));
  const today = startOfDay(new Date());
  return differenceInDays(today, start);
}

export function getWithdrawalHistory(startDate: string | Date, count: number = 5): Date[] {
  const start = startOfDay(new Date(startDate));
  const windows: Date[] = [];
  
  for (let i = 1; i <= count; i++) {
    windows.push(addDays(start, i * 15));
  }
  
  return windows;
}