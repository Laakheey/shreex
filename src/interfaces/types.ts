// Admin & User Management Types
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  token_balance: number;
  is_active: boolean;
  is_leader?: boolean;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total_revenue: number;
  monthly_revenue: number;
  half_yearly_revenue: number;
  yearly_revenue: number;
  total_users: number;
  active_investments: number;
  pending_withdrawals: number;
}

export interface Wallet {
  id: string;
  address: string;
  network: string;
  balance: number;
}

// Stock Data Types
type StockDataPoint = {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

type AlphaVantageResponse = {
  'Error Message'?: string;
  'Note'?: string;
  'Time Series (Daily)'?: {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  };
  'Global Quote'?: {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

type StockQuote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  loading: boolean;
}

type StockDataFetcherProps = {
  symbol: string;
  onDataFetched: (data: StockDataPoint[]) => void;
  onError: (error: string) => void;
}

type StockChartProps = {
  data: StockDataPoint[];
  symbol: string;
  onClose: () => void;
}

type StockCardProps = {
  stock: StockQuote;
  onClick: () => void;
  isSelected: boolean;
}

type ComparisonData = {
  name: string;
  price: number;
  color: string;
};

type DefaultChartProps = {
  data: ComparisonData[];
}

export type { 
  StockDataPoint, 
  AlphaVantageResponse, 
  StockDataFetcherProps ,
  StockQuote,
  StockCardProps,
  StockChartProps,
  ComparisonData,
  DefaultChartProps
};
