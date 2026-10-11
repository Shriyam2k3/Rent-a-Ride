"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminTopbar from "@/components/admin/admin-topbar";
import { useAuth } from "@/lib/firebase/auth-context";
import { ShieldAlert, ShieldCheck, X, ArrowRight, Loader2, Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, mongoUser, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = role === "admin" || mongoUser?.role === "admin";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAF7] flex items-center justify-center text-[#66736A]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
          <p className="text-xs font-semibold text-[#66736A] uppercase tracking-wider">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7FAF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#DDE6DF] rounded-2xl p-8 text-center shadow-lg relative overflow-hidden text-[#18251D]">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Shield className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86B18] bg-[#F7FAF7] px-3 py-1 rounded-md border border-[#DDE6DF] inline-block mb-3">
            Admin Access Restricted
          </span>

          <h2 className="text-2xl font-black text-[#18251D] tracking-tight">
            Sign In to Fleet Operations
          </h2>
          <p className="text-xs text-[#66736A] mt-2 leading-relaxed">
            Direct access to the fleet operations console is restricted. Please sign in with an authorized administrator account to manage vehicles, telemetry, and platform reservations.
          </p>

          <div className="pt-6 space-y-3">
            <Link
              href="/login?redirect=/admin"
              className="w-full py-3.5 px-4 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>Sign In to Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl border border-[#DDE6DF] hover:bg-[#F7FAF7] text-[#66736A] hover:text-[#18251D] font-bold text-xs flex items-center justify-center transition-colors"
            >
              <span>Back to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF7] text-[#18251D] flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-20">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 h-full bg-white border-r border-[#DDE6DF] shadow-2xl flex flex-col">
              <div className="absolute top-4 right-4 z-20">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#66736A] hover:text-[#18251D] bg-[#F7FAF7] border border-[#DDE6DF] cursor-pointer"
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
            <div className="bg-[#EEF5EF] border-b border-[#DDE6DF] px-4 sm:px-8 py-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#173F2D]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#A86B18] shrink-0" />
                <span>
                  Admin Console: Restricted access. Please sign in with an authorized administrator account to manage fleet operations.
                </span>
              </div>
              <Link
                href="/login?redirect=/admin"
                className="px-3 py-1 bg-[#173F2D] hover:bg-[#2F7650] text-white font-bold rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
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
