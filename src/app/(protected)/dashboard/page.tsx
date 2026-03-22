'use client';

import { Suspense } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';

const TabLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-gray-400 font-medium">Loading dashboard...</p>
  </div>
);

export default function DashboardPage() {
  return (
    <Suspense fallback={<TabLoader />}>
      <Dashboard />
    </Suspense>
  );
}
