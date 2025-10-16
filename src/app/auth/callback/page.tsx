"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const { isLoading, error, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          // Get and store the access token
          const token = await getAccessTokenSilently();
          if (token) {
            localStorage.setItem("access_token", token);
          }
          
          // Clean redirect to home page (removes query parameters)
          router.replace("/");
        } catch (error) {
          console.error("Error getting access token:", error);
          // Still redirect to home even if token fetch fails
          router.replace("/");
        }
      }
    };

    // Small delay to ensure Auth0 has processed the callback
    const timer = setTimeout(handleCallback, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, getAccessTokenSilently, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full mx-4 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Authentication Error</h1>
          <p className="text-slate-600 mb-4">{error.message}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h1 className="text-xl font-semibold text-slate-900 mt-4">Completing Sign In</h1>
        <p className="text-slate-600 mt-2">Please wait while we finish setting up your account...</p>
      </div>
    </div>
  );
}