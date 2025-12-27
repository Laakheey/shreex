import { useAuth } from "@clerk/clerk-react";
import Loading from "./Loading";
import { useSupabase } from "./providers/SupabaseProvider";
import { useEffect, useState } from "react";

const CheckActiveStatus = ({ children }: { children: React.ReactNode }) => {
  const { userId, isLoaded: authLoaded } = useAuth();
  const supabase = useSupabase();
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStatus() {
      if (!userId || !supabase) return;
      
      const { data, error } = await supabase
        .from("users")
        .select("is_active")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setIsActive(data.is_active);
      } else {
        setIsActive(false); 
      }
      setLoading(false);
    }

    if (authLoaded && userId) {
      getStatus();
    } else if (authLoaded && !userId) {
      setLoading(false);
    }
  }, [userId, supabase, authLoaded]);

  if (!authLoaded || loading) return <Loading />;

  if (isActive === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Account Suspended</h2>
          <p className="text-gray-600 mb-6">Your account has been deactivated. Please contact support if you believe this is a mistake.</p>
          <button 
            onClick={() => window.location.href = "/"} 
            className="text-indigo-600 font-semibold hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default CheckActiveStatus;