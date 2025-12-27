import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StockDataPoint, StockQuote } from "../interfaces/types";
import { X } from "lucide-react";


export const StockCard: React.FC<{
  stock: StockQuote;
  onClick: () => void;
  isSelected: boolean;
}> = ({ stock, onClick, isSelected }) => {
  const isPositive = stock.change >= 0;
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? "ring-4 ring-blue-500" : ""
      }`}
    >
      {stock.loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-gray-800">{stock.symbol}</h3>
          <p className="text-3xl font-bold text-gray-900 my-2">
            ${stock.price?.toFixed(2)}
          </p>
          <div
            className={`flex items-center font-bold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>
              {isPositive ? "▲" : "▼"} {Math.abs(stock.change).toFixed(2)} (
              {Math.abs(stock.changePercent).toFixed(2)}%)
            </span>
          </div>
        </>
      )}
    </div>
  );
};

// Updated: Comparison is now a Line Chart
export const DefaultComparisonChart: React.FC<{
  data: StockDataPoint[];
  tickers: { sym: string; color: string }[];
}> = ({ data, tickers }) => {
  tickers.forEach((element) => {
    if (element.sym === "BTC") {
      element.sym = "XYZ";
    }
  });
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h3 className="text-xl font-bold mb-6 text-gray-800 text-center md:text-left">
        Market Trends Comparison
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis dataKey="date" hide />
          <YAxis
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
          />
          <Legend verticalAlign="top" height={36} />
          {tickers.map((ticker) => (
            <Line
              key={ticker.sym}
              type="monotone"
              dataKey={ticker.sym}
              stroke={ticker.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StockChart: React.FC<{
  data: any[];
  symbol: string;
  onClose: () => void;
}> = ({ data, symbol, onClose }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg relative animate-in zoom-in-95 duration-300">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400"
      >
        <X size={24} />
      </button>
      <h3 className="text-xl font-bold mb-6 text-gray-800">
        {symbol} Performance
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis dataKey="date" hide />
          <YAxis domain={["auto", "auto"]} axisLine={false} tickLine={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
