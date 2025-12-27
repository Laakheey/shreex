// hooks/usePayoutWallets.ts
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const usePayoutWallets = ({ onRefresh }: { onRefresh: () => void }) => {
  const { getToken } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);

  const addWallet = async () => {
    if (!name.trim() || !address.trim() || !privateKey.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address.trim())) {
      toast.error("Invalid Tron address");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/withdrawal/wallets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          address: address.trim(),
          private_key: privateKey.trim(),
        }),
      });

      if (res.ok) {
        toast.success("Wallet added successfully!");
        setName("");
        setAddress("");
        setPrivateKey("");
        setShowForm(false);
        onRefresh(); // Refresh parent data
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add wallet");
      }
    } catch (err) {
      console.error("Add wallet error:", err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setPrivateKey("");
    setShowForm(false);
  };

  return {
    showForm,
    setShowForm,
    name,
    setName,
    address,
    setAddress,
    privateKey,
    setPrivateKey,
    loading,
    addWallet,
    resetForm,
  };
};