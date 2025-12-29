// SignInPage.tsx
import { SignIn } from "@clerk/clerk-react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const SignInPage = () => {
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />  {/* or "/" */}
      </SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
        </div>
      </SignedOut>
    </>
  );
};

export default SignInPage;