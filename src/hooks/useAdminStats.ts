// hooks/useAdminStats.ts
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL;

export function useAdminStats() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/admin/earning/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refresh: fetchStats };
}