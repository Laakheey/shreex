import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'bg-gray-800 text-white border border-gray-700',
            headerTitle: 'text-white text-2xl font-bold',
            headerSubtitle: 'text-gray-300',
            socialButtonsBlockButton: 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600',
            formFieldLabel: 'text-gray-300',
            formFieldInput: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
            formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            footerActionLink: 'text-indigo-400 hover:text-indigo-300',
            dividerLine: 'bg-gray-700',
            dividerText: 'text-gray-400',
          },
        }}
      />
    </div>
  );
}
