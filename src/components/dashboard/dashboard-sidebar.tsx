"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  LayoutDashboard,
  Calendar,
  User,
  Star,
  Car,
  Shield,
  LogOut,
  Headphones,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, mongoUser, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = role === "admin" || mongoUser?.role === "admin";
  const displayName = user?.displayName || mongoUser?.name || "Aarav Sharma";
  const displayEmail = user?.email || "driver@rentaride.com";
  const userInitial = (displayName || "A").charAt(0).toUpperCase();

  const navigation = [
    {
      name: "Dashboard Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Statistics & active trips",
      exact: true,
    },
    {
      name: "My Reservations",
      href: "/dashboard/bookings",
      icon: Calendar,
      description: "Manage bookings & history",
      exact: false,
    },
    {
      name: "Profile & Account",
      href: "/dashboard/profile",
      icon: User,
      description: "Driver license & settings",
      exact: false,
    },
    {
      name: "My Reviews",
      href: "/dashboard/reviews",
      icon: Star,
      description: "Ratings & feedback",
      exact: false,
    },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between space-y-6">
      <div className="space-y-6">
        {/* User Profile Mini Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white shadow-md border border-slate-700/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm text-white truncate" title={displayName}>
                {displayName}
              </h3>
              <p className="text-[11px] text-slate-300 truncate" title={displayEmail}>
                {displayEmail}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verified Driver
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div>
          <Link
            href="/cars"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all hover:shadow-md cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
              <span>Rent Another Car</span>
            </div>
            <PlusCircle className="w-4 h-4 text-emerald-200" />
          </Link>
        </div>

        {/* Main Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Driver Menu
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href, item.exact);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  active
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="truncate">
                    <span className="block truncate">{item.name}</span>
                  </div>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    active
                      ? "text-white"
                      : "text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Admin Shortcut if Admin */}
        {isAdmin && (
          <div className="pt-2">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-2">
              Privileges
            </p>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Admin Console ({user?.displayName || "Shriyam"})</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Assistance & Sign Out */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        {/* Support Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Headphones className="w-3.5 h-3.5 text-emerald-600" />
            <span>24/7 Roadside Support</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Need urgent assistance or have questions during your trip?
          </p>
          <a
            href="tel:+9118005557433"
            className="inline-block text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
          >
            Toll-Free: 1800-555-RIDE
          </a>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            setMobileOpen(false);
            logout();
          }}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar with Toggle */}
      <div className="lg:hidden w-full bg-white border border-slate-200 rounded-2xl p-3 px-4 mb-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            {userInitial}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[160px]">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Driver Portal</p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          aria-label="Toggle Dashboard Menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden w-full bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-md animate-in fade-in slide-in-from-top-2 duration-150">
          <NavContent />
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <NavContent />
        </div>
      </aside>
    </>
  );
}
