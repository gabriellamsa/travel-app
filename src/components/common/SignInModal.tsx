"use client";

import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import { AUTH_STATUS } from "../../config/auth";

interface SignInModalProps {
  onClose: () => void;
}

export default function SignInModal({ onClose }: SignInModalProps) {
  const handleGoogleSignIn = () => {
    if (!AUTH_STATUS.providers.google) {
      alert(
        "Google Sign In is not configured yet. Please check src/config/auth.ts for more information."
      );
      return;
    }
    signIn("google", { callbackUrl: "/" });
  };

  const handleFacebookSignIn = () => {
    if (!AUTH_STATUS.providers.facebook) {
      alert(
        "Facebook Sign In is not configured yet. Please check src/config/auth.ts for more information."
      );
      return;
    }
    signIn("facebook", { callbackUrl: "/" });
  };

  const handleAppleSignIn = () => {
    if (!AUTH_STATUS.providers.apple) {
      alert(
        "Apple Sign In is not configured yet. Please check src/config/auth.ts for more information."
      );
      return;
    }
    signIn("apple", { callbackUrl: "/" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center text-[var(--nomadoo-primary)] mb-2">
          Welcome,
        </h2>
        <p className="text-2xl text-center text-[var(--nomadoo-primary)] mb-6">
          Sign In with :
        </p>

        {!AUTH_STATUS.isConfigured && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            <p className="font-medium">⚠️ Authentication in Development</p>
            <p className="mt-1">
              Login features are not configured yet. Please check
              src/config/auth.ts for more information.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-[#DB4437] text-white py-2 rounded-lg hover:bg-[#c1351d] transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
          </button>
          <button
            onClick={handleAppleSignIn}
            className="w-full bg-[#1C1C1E] text-white py-2 rounded-lg hover:bg-[#2e2e30] transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
              />
            </svg>
          </button>
          <button
            onClick={handleFacebookSignIn}
            className="w-full bg-[#3b5998] text-white py-2 rounded-lg hover:bg-[#314e89] transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
              />
            </svg>
          </button>
          <button className="w-full border border-[var(--nomadoo-primary)] text-[var(--nomadoo-primary)] py-2 rounded-lg hover:bg-[var(--nomadoo-light)] transition duration-200">
            Sign in with Email
          </button>
        </div>
      </div>
    </div>
  );
}
