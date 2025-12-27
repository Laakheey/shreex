import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, ShieldCheck } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useSupabase } from "./providers/SupabaseProvider";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = useSupabase();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    async function checkAdminStatus() {
      if (isLoaded && user && supabase) {
        const { data } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        setIsAdmin(data?.is_admin || false);
      }
    }
    checkAdminStatus();
  }, [isLoaded, user, supabase]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="shrink-0 flex items-center py-1"
            >
              <img className="h-16 w-auto" src="/assets/logo.png" alt="Logo" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <SignedIn>
              {isAdmin && (
                <Link
                  to="/admin/adminPanel"
                  className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-md font-bold transition flex items-center space-x-2 border border-red-200"
                >
                  <ShieldCheck className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 font-medium transition flex items-center space-x-2"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-700 hover:text-indigo-600 font-medium transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="px-4 py-4 space-y-4">
            <SignedIn>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-12 w-12",
                      },
                    }}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-bold text-gray-900">
                      {isLoaded && user?.fullName
                        ? user.fullName
                        : user?.primaryEmailAddress?.emailAddress}
                    </span>
                    <span className="text-sm text-gray-500">View Profile</span>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <Link
                  to="/admin/adminPanel"
                  onClick={closeMobileMenu}
                  className="flex items-center w-full p-4 bg-red-50 text-red-700 rounded-lg font-bold hover:bg-red-100 transition border border-red-100"
                >
                  <ShieldCheck className="h-6 w-6 mr-3" />
                  <span className="text-lg">Admin Panel</span>
                </Link>
              )}

              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="flex items-center w-full p-4 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition"
              >
                <LayoutDashboard className="h-6 w-6 mr-3" />
                <span className="text-lg">Dashboard</span>
              </Link>
            </SignedIn>

            <SignedOut>
              <div className="space-y-3">
                <SignInButton mode="modal">
                  <button
                    onClick={closeMobileMenu}
                    className="w-full text-center bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    onClick={closeMobileMenu}
                    className="w-full text-center bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 transition"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
