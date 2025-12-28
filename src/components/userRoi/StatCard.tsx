export const StatCard = ({ title, value, color, subtitle }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <span className={`text-2xl font-black ${color}`}>
        {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <span className="text-[10px] font-bold text-gray-400">ShreeX</span>
    </div>
    <p className="text-[9px] text-gray-300 mt-3 font-bold uppercase">{subtitle}</p>
  </div>
);