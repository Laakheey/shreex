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

// import { useState, useEffect } from "react";
// import { useAuth } from "@clerk/clerk-react";
// import toast from "react-hot-toast";

// const PAGE_SIZE = 20;
// const API_BASE_URL =
//   import.meta.env.VITE_API_URL;

// interface User {
//   id: string;
//   email: string | null;
//   first_name: string | null;
//   last_name: string | null;
//   token_balance: number;
//   created_at?: string;
//   is_admin: boolean;
//   is_active: boolean;
// }

// export const useAdminPanel = () => {
//   const { getToken } = useAuth();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editAmount, setEditAmount] = useState<string>("");

//   const fetchUsers = async (page: number) => {
//     setLoading(true);

//     try {
//       const token = await getToken();

//       if (!token) {
//         toast.error("Not authenticated");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/users?page=${page}&pageSize=${PAGE_SIZE}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 403) {
//           toast.error("Admin access required");
//         } else if (response.status === 401) {
//           toast.error("Authentication failed");
//         } else {
//           const errorData = await response.json().catch(() => ({}));
//           toast.error(errorData.error || "Failed to load users");
//         }
//         setLoading(false);
//         return;
//       }

//       const data = await response.json();

//       const usersWithParsedBalance = (data.users || []).map((user: any) => ({
//         ...user,
//         token_balance: Number(user.token_balance) || 0,
//       }));

//       setUsers(usersWithParsedBalance);
//       setTotalUsers(data.totalUsers || 0);
//       setTotalPages(data.totalPages || 0);
//     } catch (error) {
//       console.error("❌ Error fetching users:", error);
//       toast.error("Failed to load users");
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUsers(currentPage);
//   }, [currentPage]);

//   const handleUpdateBalance = async (userId: string) => {
//     const amount = parseFloat(editAmount);
//     if (isNaN(amount) || amount < 0) {
//       toast.error("Enter a valid positive number");
//       return;
//     }

//     try {
//       const token = await getToken();

//       if (!token) {
//         toast.error("Not authenticated");
//         return;
//       }

//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/users/${userId}/balance`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ newBalance: amount }),
//         }
//       );

//       if (!response.ok) {
//         const error = await response
//           .json()
//           .catch(() => ({ error: "Update failed" }));
//         toast.error(error.error || "Update failed");
//         return;
//       }

//       const result = await response.json();

//       const diffText =
//         result.difference >= 0
//           ? `+${result.difference}`
//           : `${result.difference}`;
//       toast.success(`Balance updated! (${diffText} tokens)`);

//       // Update local state
//       setUsers((prev) =>
//         prev.map((u) => (u.id === userId ? { ...u, token_balance: amount } : u))
//       );
//       setEditingId(null);
//       setEditAmount("");
//     } catch (error) {
//       console.error("❌ Error updating balance:", error);
//       toast.error("Update failed");
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
//     try {
//       const token = await getToken();
//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/users/${userId}/status`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ isActive: !currentStatus }),
//         }
//       );

//       if (response.ok) {
//         setUsers((prev) =>
//           prev.map((u) =>
//             u.id === userId ? { ...u, is_active: !currentStatus } : u
//           )
//         );
//         toast.success(currentStatus ? "User suspended" : "User activated");
//       }
//     } catch (error) {
//       toast.error("Failed to update status");
//     }
//   };

//   const handleSearch = async (query: string) => {
//     if (!query) {
//       fetchUsers(1);
//       return;
//     }
//     setLoading(true);
//     try {
//       const token = await getToken();
//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/search?query=${query}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await response.json();
//       setUsers(data.users || []);
//       setTotalPages(1);
//     } catch (error) {
//       toast.error("Search failed");
//     } finally {
//       setLoading(false);
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
//     toggleUserStatus,
//     handleSearch
//   };
// };

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const PAGE_SIZE = 20;
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  token_balance: number;
  created_at?: string;
  is_admin: boolean;
  is_active: boolean;
  is_leader: boolean;
}

export const useAdminPanel = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const fetchUsers = async (page: number) => {
    console.log("🔍 fetchUsers called for page:", page);
    console.log(
      "🔐 Auth state - isLoaded:",
      isLoaded,
      "isSignedIn:",
      isSignedIn,
    );

    setLoading(true);

    try {
      console.log("📞 Getting token from Clerk...");
      const token = await getToken();
      console.log(
        "🎫 Token received:",
        token ? "YES (length: " + token.length + ")" : "NO",
      );

      if (!token) {
        console.error("❌ No token available");
        toast.error("Not authenticated");
        setLoading(false);
        return;
      }

      const url = `${API_BASE_URL}/api/admin/users?page=${page}&pageSize=${PAGE_SIZE}`;
      console.log("🌐 Fetching from:", url);
      console.log("🔑 Auth header:", `Bearer ${token.substring(0, 20)}...`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error(
          "❌ Response not OK:",
          response.status,
          response.statusText,
        );

        if (response.status === 403) {
          toast.error("Admin access required");
        } else if (response.status === 401) {
          toast.error("Authentication failed");
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ Error data:", errorData);
          toast.error(errorData.error || "Failed to load users");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("✅ Data received:", data);

      const usersWithParsedBalance = (data.users || []).map((user: any) => ({
        ...user,
        token_balance: Number(user.token_balance) || 0,
      }));

      setUsers(usersWithParsedBalance);
      setTotalUsers(data.totalUsers || 0);
      setTotalPages(data.totalPages || 0);

      console.log(
        "✅ State updated - users count:",
        usersWithParsedBalance.length,
      );
    } catch (error) {
      console.error("❌ Error fetching users:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("❌ Network error - possibly CORS or server down");
        toast.error("Network error - check connection");
      } else {
        console.error("❌ Unknown error:", error);
        toast.error("Failed to load users");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("🎬 useEffect triggered - currentPage:", currentPage);
    console.log("🔐 Auth loaded:", isLoaded, "Signed in:", isSignedIn);

    // Only fetch if auth is loaded and user is signed in
    if (isLoaded && isSignedIn) {
      fetchUsers(currentPage);
    } else if (isLoaded && !isSignedIn) {
      console.error("❌ User not signed in");
      toast.error("Please sign in first");
    }
  }, [currentPage, isLoaded, isSignedIn]);

  const handleUpdateBalance = async (userId: string) => {
    console.log("💰 Updating balance for user:", userId, "to:", editAmount);

    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Enter a valid positive number");
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        console.error("❌ No token for balance update");
        toast.error("Not authenticated");
        return;
      }

      const url = `${API_BASE_URL}/api/admin/users/${userId}/balance`;
      console.log("🌐 Updating balance at:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ newBalance: amount }),
      });

      console.log("📡 Balance update response:", response.status);

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Update failed" }));
        console.error("❌ Balance update failed:", error);
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

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, token_balance: amount } : u,
        ),
      );
      setEditingId(null);
      setEditAmount("");
    } catch (error) {
      console.error("❌ Error updating balance:", error);
      toast.error("Update failed");
    }
  };

  const handlePageChange = (newPage: number) => {
    console.log("📄 Page change requested:", currentPage, "->", newPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    console.log("🔄 Toggling status for user:", userId, "from:", currentStatus);

    try {
      const token = await getToken();

      if (!token) {
        console.error("❌ No token for status toggle");
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isActive: !currentStatus }),
        },
      );

      console.log("📡 Status toggle response:", response.status);

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_active: !currentStatus } : u,
          ),
        );
        toast.success(currentStatus ? "User suspended" : "User activated");
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("❌ Status toggle failed:", error);
        toast.error(error.error || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleSearch = async (query: string) => {
    console.log("🔍 Search initiated with query:", query);

    if (!query) {
      console.log("📝 Empty query, fetching page 1");
      fetchUsers(1);
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();

      if (!token) {
        console.error("❌ No token for search");
        toast.error("Not authenticated");
        setLoading(false);
        return;
      }

      const url = `${API_BASE_URL}/api/admin/search?query=${encodeURIComponent(query)}`;
      console.log("🌐 Searching at:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("📡 Search response:", response.status);

      const data = await response.json();
      console.log("✅ Search results:", data);

      setUsers(data.users || []);
      setTotalPages(1);
    } catch (error) {
      console.error("❌ Search error:", error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const updateUserLeaderStatus = async (
    userId: string,
    currentLeaderStatus: boolean,
  ) => {
    const newStatus = !currentLeaderStatus;
    try {
      const token = await getToken();

      if (!token) {
        console.error("❌ No token for status toggle");
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}/updateUserLeaderStatus`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ is_leader: newStatus }),
        },
      );

      console.log("📡 Status toggle response:", response.status);

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_leader: newStatus } : u,
          ),
        );
        toast.success(
          newStatus ? "User is now a leader" : "User is no longer a leader",
        );
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("❌ Status toggle failed:", error);
        toast.error(error.error || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const getAdminStats = async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.error("❌ No token for status toggle");
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/earning/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(errorData);
        toast.error(errorData.error || "Failed to fetch admin stats");
      }
      const data = await response.json();
      return data;
    } catch (err: any) {
      return null;
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
    handleSearch,
    updateUserLeaderStatus,
    getAdminStats
  };
};
