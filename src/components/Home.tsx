import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useSupabase } from "./providers/SupabaseProvider";
import { ProductDemo, AboutUs, InvestmentPlans, HeroSection } from "./";
import Loading from "./Loading";

const Home: React.FC = () => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const supabase = useSupabase();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId || !supabase) {
      setIsAdmin(false);
      return;
    }

    async function checkAdminStatus() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching admin status:", error);
          setIsAdmin(false);
          return;
        }

        setIsAdmin(data?.is_admin ?? false);
      } catch (err) {
        console.error("Unexpected error checking admin status:", err);
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [isLoaded, isSignedIn, userId, supabase]);

  if (!isLoaded || (isSignedIn && isAdmin === null)) {
    return <Loading />;
  }

  if (isSignedIn && isAdmin) {
    return <Navigate to="/admin/adminPanel" replace />;
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <HeroSection />
      <ProductDemo />
      <InvestmentPlans />
      <AboutUs />
    </>
  );
};

export default Home;