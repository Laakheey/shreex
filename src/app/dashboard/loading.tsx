export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-10 w-80 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
