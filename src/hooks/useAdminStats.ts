// // hooks/useAdminStats.ts
// import { useState, useEffect } from "react";
// import { useAuth } from "@clerk/clerk-react";

// const API_URL = import.meta.env.VITE_API_URL;

// export function useAdminStats() {
//   const { getToken } = useAuth();
//   const [stats, setStats] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const token = await getToken();
//       const res = await fetch(`${API_URL}/api/admin/earning/stats`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch stats");
//       const data = await res.json();
//       setStats(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   return { stats, loading, error, refresh: fetchStats };
// }

// hooks/useAdminStats.ts
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export function useAdminStats() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    console.log("📊 fetchStats called");
    console.log("🔐 Auth state - isLoaded:", isLoaded, "isSignedIn:", isSignedIn);

    try {
      setLoading(true);
      setError(null);

      console.log("📞 Getting token from Clerk...");
      const token = await getToken();
      console.log("🎫 Token received:", token ? "YES (length: " + token.length + ")" : "NO");

      if (!token) {
        console.error("❌ No token available for stats");
        const errorMsg = "Not authenticated";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      const url = `${API_URL}/api/admin/earning/stats`;
      console.log("🌐 Fetching stats from:", url);
      console.log("🔑 Auth header:", `Bearer ${token.substring(0, 20)}...`);

      const res = await fetch(url, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("📡 Response status:", res.status);
      console.log("📡 Response ok:", res.ok);
      console.log("📡 Response headers:", Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        console.error("❌ Response not OK:", res.status, res.statusText);
        
        const errorData = await res.json().catch(() => ({ error: "Failed to fetch stats" }));
        console.error("❌ Error data:", errorData);
        
        const errorMsg = errorData.error || `Failed to fetch stats (${res.status})`;
        
        if (res.status === 403) {
          toast.error("Admin access required");
        } else if (res.status === 401) {
          toast.error("Authentication failed - please sign in again");
        } else {
          toast.error(errorMsg);
        }
        
        throw new Error(errorMsg);
      }

      const data = await res.json();
      console.log("✅ Stats data received:", data);
      
      setStats(data);
      setError(null);
    } catch (err: any) {
      console.error("❌ Error fetching stats:", err);
      
      // More detailed error logging
      if (err instanceof TypeError && err.message.includes("fetch")) {
        console.error("❌ Network error - possibly CORS or server down");
        const errorMsg = "Network error - check your connection";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        console.error("❌ Error type:", err.constructor.name);
        console.error("❌ Error message:", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
      console.log("✅ fetchStats completed");
    }
  };

  useEffect(() => {
    console.log("🎬 useAdminStats useEffect triggered");
    console.log("🔐 Auth loaded:", isLoaded, "Signed in:", isSignedIn);
    
    // Only fetch if auth is loaded and user is signed in
    if (isLoaded && isSignedIn) {
      fetchStats();
    } else if (isLoaded && !isSignedIn) {
      console.error("❌ User not signed in");
      setError("Please sign in first");
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  return { stats, loading, error, refresh: fetchStats };
}