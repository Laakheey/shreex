'use client';

import { Suspense } from 'react';
import AdminPanel from '@/components/AdminPanel';

const AdminLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-gray-400 font-medium">Loading admin panel...</p>
  </div>
);

export default function AdminPanelPage() {
  return (
    <Suspense fallback={<AdminLoader />}>
      <AdminPanel />
    </Suspense>
  );
}
