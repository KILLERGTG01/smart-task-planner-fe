"use client";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";

export default function Nav() {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">Smart Task Planner</Link>
        <div className="flex items-center gap-3">
          <Link href="/history" className="hidden sm:inline text-sm text-slate-600">History</Link>
          {!isLoading && isAuthenticated ? (
            <>
              <div className="text-sm text-slate-700 hidden md:block">{user?.name ?? user?.email}</div>
              <button onClick={() => { localStorage.removeItem("access_token"); logout({ logoutParams: { returnTo: window.location.origin } }); }} className="px-3 py-1 border rounded text-sm">Logout</button>
            </>
          ) : (
            <button onClick={() => loginWithRedirect()} className="px-3 py-1 border rounded text-sm">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
}
