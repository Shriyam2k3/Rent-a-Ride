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
  const displayName = user?.displayName || mongoUser?.name || "Customer";
  const displayEmail = user?.email || "customer@rentaride.com";
  const userInitial = (displayName || "C").charAt(0).toUpperCase();

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
      description: "Profile & account settings",
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
        <div className="p-4 rounded-2xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#18251D] relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#173F2D] text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-sm text-[#18251D] truncate" title={displayName}>
                {displayName}
              </h3>
              <p className="text-[11px] text-[#66736A] truncate" title={displayEmail}>
                {displayEmail}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#173F2D] border border-[#DDE6DF]">
                  <ShieldCheck className="w-3 h-3 text-[#173F2D]" />
                  Verified Customer
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
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white text-xs font-bold shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
              <span>Rent Another Car</span>
            </div>
            <PlusCircle className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* Main Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-[#173F2D] mb-2">
            CUSTOMER MENU
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
                    ? "bg-[#EEF5EF] text-[#173F2D] font-bold border border-[#DDE6DF]"
                    : "text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      active
                        ? "bg-[#173F2D] text-white"
                        : "bg-[#F7FAF7] text-[#66736A] group-hover:bg-[#EEF5EF] group-hover:text-[#173F2D]"
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
                      ? "text-[#173F2D]"
                      : "text-slate-400 group-hover:text-[#18251D] group-hover:translate-x-0.5"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Admin Shortcut if Admin */}
        {isAdmin && (
          <div className="pt-2">
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-[#A86B18] mb-2">
              PRIVILEGES
            </p>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#F7FAF7] text-[#18251D] hover:bg-[#EEF5EF] border border-[#DDE6DF] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#A86B18]" />
                <span>Admin Console</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#66736A]" />
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Assistance & Sign Out */}
      <div className="space-y-4 pt-4 border-t border-[#DDE6DF]">
        {/* Support Card */}
        <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] text-[#18251D] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#18251D]">
            <Headphones className="w-3.5 h-3.5 text-[#173F2D]" />
            <span>24/7 Roadside Support</span>
          </div>
          <p className="text-[11px] text-[#66736A] leading-relaxed">
            Need urgent assistance or have questions during your trip?
          </p>
          <a
            href="tel:+9118005557433"
            className="inline-block text-[11px] font-bold text-[#173F2D] hover:text-[#2F7650]"
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
          className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-bold text-[#B42318] hover:bg-red-50 transition-colors cursor-pointer"
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
      <div className="lg:hidden w-full bg-white border border-[#DDE6DF] rounded-2xl p-3 px-4 mb-4 flex items-center justify-between shadow-xs text-[#18251D]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#173F2D] text-white flex items-center justify-center font-bold text-xs">
            {userInitial}
          </div>
          <div>
            <p className="text-xs font-bold text-[#18251D] leading-none truncate max-w-[160px]">
              {displayName}
            </p>
            <p className="text-[10px] text-[#66736A] mt-0.5">Customer Portal</p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-[#F7FAF7] text-[#18251D] hover:bg-[#EEF5EF] border border-[#DDE6DF] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          aria-label="Toggle Dashboard Menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden w-full bg-white border border-[#DDE6DF] rounded-2xl p-5 mb-6 shadow-md animate-in fade-in slide-in-from-top-2 duration-150">
          <NavContent />
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-white border border-[#DDE6DF] rounded-3xl p-5 shadow-xs">
          <NavContent />
        </div>
      </aside>
    </>
  );
}
