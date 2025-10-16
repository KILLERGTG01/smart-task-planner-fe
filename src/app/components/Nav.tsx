"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getStoredUser, logout, User } from "@/app/lib/customAuth";

export default function Nav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      const userData = getStoredUser();
      
      setAuthenticated(authStatus);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">Smart Task Planner</Link>
        <div className="flex items-center gap-3">
          <Link href="/history" className="hidden sm:inline text-sm text-slate-600">History</Link>
          {!loading && authenticated ? (
            <>
              <div className="text-sm text-slate-700 hidden md:block">{user?.name ?? user?.email}</div>
              <button 
                onClick={() => logout()} 
                className="px-3 py-1 border rounded text-sm hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => router.push("/auth/login")} 
              className="px-3 py-1 border rounded text-sm hover:bg-slate-50"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
