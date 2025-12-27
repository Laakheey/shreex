import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  AdminPanel,
  Dashboard,
  SignInPage,
  SignUpPage,
} from "./components/index.ts";
import { SupabaseProvider } from "./components/providers/SupabaseProvider.tsx";
import { AuthGuard } from "./components/AuthGuard.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "dashboard",
        element: (
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        ),
      },
      {
        path: "admin/adminPanel",
        element: (
          <AuthGuard requireAdmin>
            <AdminPanel />
          </AuthGuard>
        ),
      },
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SupabaseProvider>
        <RouterProvider router={router} />
      </SupabaseProvider>
    </ClerkProvider>
  </StrictMode>
);
