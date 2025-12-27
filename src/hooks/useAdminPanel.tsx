// // hooks/useAdminPanel.ts

// import { useState, useEffect } from "react";
// import { useSupabase } from "../components/providers/SupabaseProvider";
// import toast from "react-hot-toast";

// const PAGE_SIZE = 20;

// interface User {
//   id: string;
//   email: string | null;
//   first_name: string | null;
//   last_name: string | null;
//   token_balance: number;
// }

// export const useAdminPanel = () => {
//   const supabase = useSupabase();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editAmount, setEditAmount] = useState<string>("");

//   const fetchUsers = async (page: number) => {
//     if (!supabase) return;

//     setLoading(true);

//     const from = (page - 1) * PAGE_SIZE;
//     const to = from + PAGE_SIZE - 1;

//     const { data, error, count } = await supabase
//       .from("users")
//       .select("id, email, first_name, last_name, token_balance", { count: "exact" })
//       .order("token_balance", { ascending: false })
//       .range(from, to);

//     if (error) {
//       toast.error("Failed to load users");
//       console.error(error);
//     } else {
//       setUsers(data || []);
//       setTotalUsers(count || 0);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUsers(currentPage);
//   }, [currentPage, supabase]);

//   const handleUpdateBalance = async (userId: string) => {
//     const amount = parseFloat(editAmount);
//     if (isNaN(amount) || amount < 0) {
//       toast.error("Enter a valid positive number");
//       return;
//     }

//     const oldUser = users.find((u) => u.id === userId);
//     if (!oldUser) return;

//     const difference = amount - oldUser.token_balance;

//     const { error } = await supabase!
//       .from("users")
//       .update({ token_balance: amount })
//       .eq("id", userId);

//     if (error) {
//       toast.error("Update failed");
//       console.error(error);
//     } else {
//       toast.success("Balance updated!");

//       // Log transaction
//       if (difference !== 0) {
//         await supabase!.from("transactions").insert({
//           user_id: userId,
//           amount: Math.abs(difference),
//           type: difference >= 0 ? "reward" : "withdrawal",
//           description: `Admin adjusted balance ${difference >= 0 ? "+" : ""}${difference} tokens`,
//           reference_type: "admin_adjust",
//         });
//       }

//       setUsers((prev) =>
//         prev.map((u) => (u.id === userId ? { ...u, token_balance: amount } : u))
//       );
//       setEditingId(null);
//       setEditAmount("");
//     }
//   };

//   const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   return {
//     users,
//     loading,
//     currentPage,
//     totalPages,
//     totalUsers,
//     editingId,
//     setEditingId,
//     editAmount,
//     setEditAmount,
//     handleUpdateBalance,
//     handlePageChange,
//   };
// };

// hooks/useAdminPanel.ts

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const PAGE_SIZE = 20;
const API_BASE_URL =
  import.meta.env.VITE_API_URL;

interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  token_balance: number;
  created_at?: string;
  is_admin: boolean;
  is_active: boolean;
}

export const useAdminPanel = () => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const fetchUsers = async (page: number) => {
    setLoading(true);

    try {
      const token = await getToken();
      console.log(token);

      if (!token) {
        toast.error("Not authenticated");
        setLoading(false);
        return;
      }

      console.log("📡 Fetching users page:", page);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users?page=${page}&pageSize=${PAGE_SIZE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          toast.error("Admin access required");
        } else if (response.status === 401) {
          toast.error("Authentication failed");
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || "Failed to load users");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      console.log("✅ Received:", data.users?.length, "users");

      // Convert token_balance from string/numeric to number for display
      const usersWithParsedBalance = (data.users || []).map((user: any) => ({
        ...user,
        token_balance: Number(user.token_balance) || 0,
      }));

      setUsers(usersWithParsedBalance);
      setTotalUsers(data.totalUsers || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      toast.error("Failed to load users");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleUpdateBalance = async (userId: string) => {
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Enter a valid positive number");
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      console.log("💰 Updating balance for user:", userId, "to:", amount);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}/balance`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newBalance: amount }),
        }
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Update failed" }));
        toast.error(error.error || "Update failed");
        return;
      }

      const result = await response.json();

      console.log("✅ Balance updated:", result);

      const diffText =
        result.difference >= 0
          ? `+${result.difference}`
          : `${result.difference}`;
      toast.success(`Balance updated! (${diffText} tokens)`);

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, token_balance: amount } : u))
      );
      setEditingId(null);
      setEditAmount("");
    } catch (error) {
      console.error("❌ Error updating balance:", error);
      toast.error("Update failed");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_active: !currentStatus } : u
          )
        );
        toast.success(currentStatus ? "User suspended" : "User activated");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      fetchUsers(1);
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/admin/search?query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(1); // Search results usually don't need complex pagination initially
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    currentPage,
    totalPages,
    totalUsers,
    editingId,
    setEditingId,
    editAmount,
    setEditAmount,
    handleUpdateBalance,
    handlePageChange,
    toggleUserStatus,
    handleSearch
  };
};
