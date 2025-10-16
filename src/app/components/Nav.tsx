"use client";
import Link from "next/link";

export default function Nav() {
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
          <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
