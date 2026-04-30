"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, ShieldCheck } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/actions/user";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      getCurrentUser().then((u) => setIsAdmin(u?.isAdmin ?? false));
    }
  }, [isLoaded, user]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="shrink-0 flex items-center py-1">
            <img className="h-16 w-auto" src="/assets/logo.png" alt="Logo" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <SignedIn>
              {isAdmin && (
                <Link
                  href="/admin/adminPanel"
                  className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-md font-bold transition flex items-center space-x-2 border border-red-200"
                >
                  <ShieldCheck className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-indigo-600 font-medium transition flex items-center space-x-2"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <UserButton
                appearance={{ elements: { avatarBox: "h-10 w-10" } }}
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
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
                    appearance={{ elements: { avatarBox: "h-12 w-12" } }}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-bold text-gray-900">
                      {user?.fullName || user?.primaryEmailAddress?.emailAddress}
                    </span>
                    <span className="text-sm text-gray-500">View Profile</span>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <Link
                  href="/admin/adminPanel"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full p-4 bg-red-50 text-red-700 rounded-lg font-bold hover:bg-red-100 transition border border-red-100"
                >
                  <ShieldCheck className="h-6 w-6 mr-3" />
                  <span className="text-lg">Admin Panel</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full p-4 bg-gray-50 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <LayoutDashboard className="h-6 w-6 mr-3" />
                <span className="text-lg">Dashboard</span>
              </Link>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
