// components/AuthGuard.tsx
import { RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { useSupabase } from "./providers/SupabaseProvider";
import { useEffect, useState } from "react";
import Loading from "./Loading";
// import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: Props) {
  const { isLoaded: authLoaded, isSignedIn, userId } = useAuth();
  const supabase = useSupabase();
  const [status, setStatus] = useState<{
    active: boolean;
    admin: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    if (!userId || !supabase) {
      setLoading(false);
      return;
    }

    async function checkUser() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("is_active, is_admin")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user status:", error);
          setLoading(false);
          return;
        }

        setStatus({
          active: data?.is_active ?? true,
          admin: data?.is_admin ?? false,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [authLoaded, isSignedIn, userId, supabase]);

  if (!authLoaded || loading) return <Loading />;
  if (!isSignedIn) return <RedirectToSignIn />;

  if (status?.active === false) {
    return <div className="p-20 text-center">Your account is suspended.</div>;
  }

  if (requireAdmin && !status?.admin) {
    return (
      <div className="p-20 text-center text-red-600">
        Access Denied: Admins Only.
      </div>
    );
  }

  return <>{children}</>;
}
