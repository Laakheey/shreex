// SignUpPage.tsx
import { SignUp } from "@clerk/clerk-react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const SignUpPage = () => {
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            unsafeMetadata={{
              referral_code: localStorage.getItem("pending_referral_code"),
            }}
          />
        </div>
      </SignedOut>
    </>
  );
};

export default SignUpPage;
