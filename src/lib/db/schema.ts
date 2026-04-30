import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  serial,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "pending",
  "approved",
  "rejected",
  "sent",
]);

export const tokenRequestStatusEnum = pgEnum("token_request_status", [
  "pending",
  "approved",
  "rejected",
  "conflicted",
]);

export const investmentStatusEnum = pgEnum("investment_status", [
  "active",
  "inactive",
  "matured",
]);

export const planTypeEnum = pgEnum("plan_type", [
  "monthly",
  "half-yearly",
  "yearly",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "credit",
  "debit",
  "investment_deposit",
  "withdrawal",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  tokenBalance: numeric("token_balance", { precision: 18, scale: 4 }).default("0").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isLeader: boolean("is_leader").default(false).notNull(),
  referrerId: text("referrer_id"),
  referralCode: text("referral_code").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tokenRequests = pgTable("token_requests", {
  id: serial("id").primaryKey(),
  requestId: text("request_id").unique(),
  userId: text("user_id").references(() => users.id).notNull(),
  amountUsdt: numeric("amount_usdt", { precision: 18, scale: 4 }).notNull(),
  status: text("status").default("pending").notNull(),
  txHash: text("tx_hash"),
  screenshotUrl: text("screenshot_url"),
  detectedAmount: numeric("detected_amount", { precision: 18, scale: 4 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  amountTokens: numeric("amount_tokens", { precision: 18, scale: 4 }).notNull(),
  initialAmount: numeric("initial_amount", { precision: 18, scale: 4 }),
  planType: text("plan_type").notNull(),
  status: text("status").default("active").notNull(),
  startDate: date("start_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  amount: numeric("amount", { precision: 18, scale: 4 }).notNull(),
  type: text("type").notNull(),
  description: text("description"),
  planType: text("plan_type"),
  investmentId: integer("investment_id"),
  referenceId: text("reference_id"),
  referenceType: text("reference_type"),
  txHash: text("tx_hash"),
  status: text("status"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminTransactions = pgTable("admin_transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  amount: numeric("amount", { precision: 18, scale: 4 }).notNull(),
  transactionType: text("transaction_type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  amount: numeric("amount", { precision: 18, scale: 4 }).notNull(),
  walletAddress: text("wallet_address"),
  phoneNumber: text("phone_number"),
  status: text("status").default("pending").notNull(),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  isAdminReply: boolean("is_admin_reply").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const referralBonuses = pgTable("referral_bonuses", {
  id: serial("id").primaryKey(),
  referrerId: text("referrer_id").references(() => users.id).notNull(),
  referredUserId: text("referred_user_id").references(() => users.id),
  amount: numeric("amount", { precision: 18, scale: 4 }).notNull(),
  bonusType: text("bonus_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const payoutWallets = pgTable("payout_wallets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  encryptedPrivateKey: text("encrypted_private_key"),
  balance: numeric("balance", { precision: 18, scale: 4 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const interestPayouts = pgTable("interest_payouts", {
  id: serial("id").primaryKey(),
  investmentId: integer("investment_id").references(() => investments.id).notNull(),
  amountAdded: numeric("amount_added", { precision: 18, scale: 4 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userEarningSummaries = pgTable("user_earning_summaries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  totalLifetimeRoi: numeric("total_lifetime_roi", { precision: 18, scale: 4 }).default("0"),
  totalMonthlyRoi: numeric("total_monthly_roi", { precision: 18, scale: 4 }).default("0"),
  totalHalfYearlyRoi: numeric("total_half_yearly_roi", { precision: 18, scale: 4 }).default("0"),
  totalYearlyRoi: numeric("total_yearly_roi", { precision: 18, scale: 4 }).default("0"),
});

export const userMonthlyPerformance = pgTable("user_monthly_performance", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  monthYear: date("month_year").notNull(),
  monthlyRoi: numeric("monthly_roi", { precision: 18, scale: 4 }).default("0"),
});

export const adminEarningsDashboard = pgTable("admin_earnings_dashboard", {
  id: serial("id").primaryKey(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Investment = typeof investments.$inferSelect;
export type TokenRequest = typeof tokenRequests.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type SupportMessage = typeof supportMessages.$inferSelect;
export type ReferralBonus = typeof referralBonuses.$inferSelect;
export type PayoutWallet = typeof payoutWallets.$inferSelect;
