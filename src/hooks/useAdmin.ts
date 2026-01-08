// hooks/useAdmin.ts

import { useCallback, useState } from 'react';
import { supabase } from '../utils/supabase';
// import { supabase } from '@/config/supabase'; // ← Your Supabase client with SERVICE_ROLE_KEY

// ======================== Types ========================

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  token_balance: number;
  created_at: string;
  is_admin: boolean;
  is_active?: boolean;
}

export interface TokenRequest {
  request_id: string;
  user_id: string;
  amount_usdt: number;
  status: string;
  tx_hash: string | null;
  screenshot_url: string | null;
  detected_amount: number | null;
  created_at: string;
}

export interface AdminTransaction {
  id: number;
  user_id: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export interface CombinedTransaction {
  id: string | number;
  type: 'token_request' | 'admin_adjustment';
  amount: number;
  status?: string;
  transaction_type?: 'credit' | 'debit';
  description?: string;
  created_at: string;
  details?: {
    tx_hash?: string | null;
    screenshot_url?: string | null;
    detected_amount?: number | null;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalTokens: number;
  pendingRequests: number;
  recentTransactions: number;
  timestamp: string;
}

export interface SupportChat {
  user_id: string;
  user_name: string;
  user_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface ChatMessage {
  id: number;
  content: string | null;
  image_url: string | null;
  is_admin_reply: boolean;
  created_at: string;
}

export interface AdminEarnings {
  [key: string]: any;
}

// ======================== Hook ========================

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // ======================== Helper ========================

  const handleError = (err: any) => {
    const message = err.message || 'An unknown error occurred';
    setError(message);
    console.error(err);
  };

  // ======================== 1. Get Users ========================

  const getUsers = useCallback(async (page: number = 1, pageSize: number = 20) => {
    setLoading(true);
    clearError();
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, token_balance, created_at, is_admin', { count: 'exact' })
        .order('token_balance', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        users: data || [],
        totalUsers: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / pageSize),
        pageSize,
      };
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== 2. Update User Balance ========================

  const updateUserBalance = useCallback(async (userId: string, newBalance: number) => {
    setLoading(true);
    clearError();
    try {
      if (typeof newBalance !== 'number' || newBalance < 0) {
        throw new Error('Invalid balance amount');
      }

      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('token_balance, email, first_name')
        .eq('id', userId)
        .single();

      if (fetchError || !user) throw new Error('User not found');

      const oldBalance = Number(user.token_balance) || 0;
      const difference = newBalance - oldBalance;

      const { error: updateError } = await supabase
        .from('users')
        .update({ token_balance: newBalance })
        .eq('id', userId);

      if (updateError) throw updateError;

      if (difference !== 0) {
        const { error: logError } = await supabase.from('admin_transactions').insert({
          user_id: userId,
          amount: Math.abs(difference),
          transaction_type: difference >= 0 ? 'credit' : 'debit',
          description: `Admin adjusted balance ${difference >= 0 ? '+' : ''}${difference} tokens`,
        });

        if (logError) console.warn('Failed to log admin transaction:', logError);
      }

      return {
        success: true,
        newBalance,
        previousBalance: oldBalance,
        difference,
        message: 'Balance updated successfully',
      };
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== 3. Get User Transactions ========================

  const getUserTransactions = useCallback(async (userId: string, page: number = 1, pageSize: number = 50) => {
    setLoading(true);
    clearError();
    try {
      const [tokenReqRes, adminTxRes] = await Promise.all([
        supabase
          .from('token_requests')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('admin_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      ]);

      if (tokenReqRes.error) throw tokenReqRes.error;
      if (adminTxRes.error) throw adminTxRes.error;

      const allTransactions: CombinedTransaction[] = [
        ...(tokenReqRes.data || []).map((tr: TokenRequest) => ({
          id: tr.request_id,
          type: 'token_request' as const,
          amount: tr.amount_usdt,
          status: tr.status,
          created_at: tr.created_at,
          details: {
            tx_hash: tr.tx_hash,
            screenshot_url: tr.screenshot_url,
            detected_amount: tr.detected_amount,
          },
        })),
        ...(adminTxRes.data || []).map((at: AdminTransaction) => ({
          id: at.id,
          type: 'admin_adjustment' as const,
          amount: at.amount,
          transaction_type: at.transaction_type,
          description: at.description,
          created_at: at.created_at,
        })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const from = (page - 1) * pageSize;
      const to = from + pageSize;

      return {
        transactions: allTransactions.slice(from, to),
        totalTransactions: allTransactions.length,
        currentPage: page,
        totalPages: Math.ceil(allTransactions.length / pageSize),
        pageSize,
      };
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== 4. Dashboard Stats ========================

  const getDashboardStats = useCallback(async (): Promise<DashboardStats | null> => {
    setLoading(true);
    clearError();
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const [
        { count: totalUsers },
        { data: users },
        { count: pendingRequests },
        { count: recentTransactions },
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('token_balance'),
        supabase.from('token_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase
          .from('token_requests')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString()),
      ]);

      const totalTokens = users?.reduce((sum: any, u: any) => sum + Number(u.token_balance || 0), 0) || 0;

      return {
        totalUsers: totalUsers || 0,
        totalTokens,
        pendingRequests: pendingRequests || 0,
        recentTransactions: recentTransactions || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== 5. Search Users ========================

  const searchUsers = useCallback(async (query: string, limit: number = 20) => {
    if (!query?.trim()) {
      setError('Search query is required');
      return null;
    }

    setLoading(true);
    clearError();
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, token_balance, created_at')
        .or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return { users: data || [], query };
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== 6. Toggle User Status ========================

  const toggleUserStatus = useCallback(async (userId: string, isActive: boolean) => {
    setLoading(true);
    clearError();
    try {
      const { error } = await supabase.from('users').update({ is_active: isActive }).eq('id', userId);

      if (error) throw error;

      return { success: true };
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== 7. Support Chats ========================

  const getSupportChats = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const { data: chatUsers, error: usersError } = await supabase
        .from('support_messages')
        .select('user_id')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const uniqueUserIds = [...new Set(chatUsers?.map((c: any) => c.user_id))];

      if (uniqueUserIds.length === 0) {
        return { chats: [] };
      }

      const { data: profiles, error: profileError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name')
        .in('id', uniqueUserIds);

      if (profileError) throw profileError;

      const chats = await Promise.all(
        profiles!.map(async (user: any) => {
          const { data: messages, error: msgError } = await supabase
            .from('support_messages')
            .select('content, image_url, is_admin_reply, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (msgError || !messages || messages.length === 0) return null;

          const lastMsg = messages[0];
          const lastMessageText = lastMsg.image_url ? 'Image' : lastMsg.content || 'Media';

          const { count: unreadCount } = await supabase
            .from('support_messages')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_admin_reply', false)
            .is('read_at', null);

          return {
            user_id: user.id,
            user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
            user_email: user.email || 'No email',
            last_message: lastMessageText,
            last_message_time: lastMsg.created_at,
            unread_count: unreadCount || 0,
          };
        })
      );

      const validChats = chats.filter(Boolean) as SupportChat[];

      validChats.sort(
        (a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
      );

      return { chats: validChats };
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== 8. Get Chat Messages ========================

  const getUserChatMessages = useCallback(async (userId: string) => {
    setLoading(true);
    clearError();
    try {
      const { data: messages, error } = await supabase
        .from('support_messages')
        .select('id, content, image_url, is_admin_reply, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return { messages: messages || [] };
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== 9. Send Admin Reply ========================

  const sendAdminReply = useCallback(async (user_id: string, content?: string, image_url?: string) => {
    if (!user_id || (!content?.trim() && !image_url)) {
      setError('Invalid message');
      return null;
    }

    setLoading(true);
    clearError();
    try {
      const { data: newMessage, error } = await supabase
        .from('support_messages')
        .insert({
          user_id,
          content: content?.trim() || null,
          image_url: image_url || null,
          is_admin_reply: true,
        })
        .select()
        .single();

      if (error) throw error;

      return { message: newMessage };
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== 10. Admin Earnings Stats ========================

  const getAdminStats = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const { data, error } = await supabase.from('admin_earnings_dashboard').select('*').single();

      if (error) throw error;

      return data as AdminEarnings;
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== Return ========================

  return {
    loading,
    error,
    clearError,

    getUsers,
    updateUserBalance,
    getUserTransactions,
    getDashboardStats,
    searchUsers,
    toggleUserStatus,
    getSupportChats,
    getUserChatMessages,
    sendAdminReply,
    getAdminStats,
  };
};