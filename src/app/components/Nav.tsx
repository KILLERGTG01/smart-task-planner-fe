"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import LoginButton from "@/components/auth/LoginButton";
import UserProfile from "@/components/auth/UserProfile";

export default function Nav() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Smart Task Planner
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Home
          </Link>
          
          {isAuthenticated && (
            <>
              <Link href="/history" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                History
              </Link>
              <Link href="/profile" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Profile
              </Link>
            </>
          )}
          
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : isAuthenticated ? (
              <UserProfile showLogout={false} />
            ) : (
              <LoginButton className="text-sm px-3 py-1.5">
                Sign In
              </LoginButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
