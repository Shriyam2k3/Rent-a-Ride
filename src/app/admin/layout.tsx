"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminTopbar from "@/components/admin/admin-topbar";
import { useAuth } from "@/lib/firebase/auth-context";
import { ShieldAlert, ShieldCheck, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, mongoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = role === "admin" || mongoUser?.role === "admin";

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-20">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 h-full bg-white shadow-2xl flex flex-col">
              <div className="absolute top-4 right-4 z-20">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <AdminSidebar onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

          {/* Access guard alert if not admin */}
          {!isAdmin && (
            <div className="bg-amber-50 border-b border-amber-200/80 px-4 sm:px-8 py-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Admin Console: Restricted access. Please sign in with an authorized administrator account to manage fleet operations.
                </span>
              </div>
              <Link
                href="/login?redirect=/admin"
                className="px-3 py-1 bg-[#101827] hover:bg-[#172033] text-white font-bold rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
