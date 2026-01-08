// components/admin/UsersManagement.tsx

import { useState, useEffect } from "react";
// import { useAdmin } from "@/hooks/useAdmin"; // ← Our direct Supabase hook
// import UserTransactionHistoryModal from "../components/UserTransactionHistoryModal";
import { Search, Gavel, ShieldCheck, User, Mail, History, Edit2, Check, X } from "lucide-react";
import { useAdmin } from "../../hooks/useAdmin";
import UserTransactionHistoryModal from "../../components/UserTransactionHistoryModal";
import toast from "react-hot-toast";

const UsersManagement = () => {
  const {
    getUsers,
    searchUsers,
    updateUserBalance,
    toggleUserStatus,
    loading: adminLoading,
    error: adminError,
  } = useAdmin();

  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load users on mount and page change
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const result = await getUsers(currentPage, 20);
      if (result) {
        setUsers(result.users);
        setTotalPages(result.totalPages);
      }
      setLoading(false);
    };

    if (!isSearching) {
      loadUsers();
    }
  }, [currentPage, getUsers, isSearching]);

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setCurrentPage(1);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    const result = await searchUsers(query.trim(), 100);
    if (result && result.users) {
      setUsers(result.users);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateBalance = async (userId: string) => {
    const amount = Number(editAmount);
    if (isNaN(amount) || amount < 0) {
      toast("Please enter a valid positive number");
      return;
    }

    const confirmed = window.confirm(
      `Update balance to ${amount.toLocaleString()} tokens?`
    );
    if (!confirmed) return;

    setLoading(true);
    const result = await updateUserBalance(userId, amount);
    if (result?.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, token_balance: amount } : u
        )
      );
      setEditingId(null);
      setEditAmount("");
      toast("Balance updated successfully!");
    } else {
      toast("Failed to update balance");
    }
    setLoading(false);
  };

  // Handle user ban/unban
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? "ban" : "unban";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );
    if (!confirmed) return;

    setLoading(true);
    const result = await toggleUserStatus(userId, !currentStatus);
    if (result?.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_active: !currentStatus } : u
        )
      );
      toast(`User has been ${!currentStatus ? "banned" : "unbanned"}`);
    } else {
      toast("Failed to update user status");
    }
    setLoading(false);
  };

  if (loading || adminLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (adminError) {
    return (
      <div className="p-20 text-center text-red-500">
        Error: {adminError}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 text-sm">
            Manage balances, search profiles, and moderate accounts.
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            className="w-full pl-12 pr-24 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <button
            onClick={() => {
              if (searchQuery.trim()) {
                handleSearch(searchQuery);
              } else {
                setIsSearching(false);
                setCurrentPage(1);
              }
            }}
            className="absolute right-2 top-2 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-black transition-colors"
          >
            {searchQuery.trim() ? "Search" : "Clear"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm font-semibold">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4 text-center">Token Balance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className={`transition-colors ${
                      u.is_active === false ? "bg-red-50/50" : "hover:bg-gray-50/80"
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            u.is_active === false
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2">
                            {u.first_name || "No"} {u.last_name || "Name"}
                            {u.is_active === false && (
                              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded uppercase tracking-wider">
                                Banned
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            ID: {u.id.slice(-12)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail size={14} className="text-gray-400" />
                        {u.email}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      {editingId === u.id ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-24 px-2 py-1 border border-green-500 rounded text-sm focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateBalance(u.id)}
                            className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditAmount("");
                            }}
                            className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full font-bold text-sm cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={() => {
                            setEditingId(u.id);
                            setEditAmount(u.token_balance.toString());
                          }}
                        >
                          {u.token_balance.toLocaleString()}
                          <Edit2 size={12} className="opacity-50" />
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex gap-4 justify-end">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="flex items-center gap-1.5 text-purple-600 hover:text-purple-800 text-sm font-semibold transition-colors cursor-pointer"
                        >
                          <History size={16} />
                          History
                        </button>

                        <button
                          onClick={() => handleToggleStatus(u.id, u.is_active ?? true)}
                          className={`flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                            u.is_active === false
                              ? "text-green-600 hover:text-green-800"
                              : "text-red-600 hover:text-red-800"
                          }`}
                        >
                          {u.is_active === false ? (
                            <>
                              <ShieldCheck size={16} /> Unban
                            </>
                          ) : (
                            <>
                              <Gavel size={16} /> Ban User
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-500">
                    {isSearching
                      ? "No users found matching your search."
                      : "No users available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (only show when not searching) */}
        {!isSearching && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 text-sm font-bold rounded-lg transition-all ${
                    currentPage === page
                      ? "bg-gray-900 text-white shadow-md scale-110"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Transaction History Modal */}
      {selectedUser && (
        <UserTransactionHistoryModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UsersManagement;