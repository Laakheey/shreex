import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}

export default SignInPage