"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "./customAuth";

interface WithAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function WithAuth({ children, fallback }: WithAuthProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      setLoading(false);
      
      if (!authStatus) {
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!authenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}

// Higher-order component version
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <WithAuth fallback={fallback}>
        <Component {...props} />
      </WithAuth>
    );
  };
}