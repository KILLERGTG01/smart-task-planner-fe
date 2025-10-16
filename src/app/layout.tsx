// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Nav from "@/app/components/Nav";

export const metadata = {
  title: "Smart Task Planner",
  description: "AI-powered task breakdowns",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
          <footer className="text-center py-6 text-sm text-slate-500">© {new Date().getFullYear()} Smart Task Planner</footer>
        </div>
      </body>
    </html>
  );
}
