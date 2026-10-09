"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  UserCheck,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Fleet Management",
      href: "/admin/cars",
      icon: Car,
      exact: false,
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: CalendarCheck,
      exact: false,
    },
    {
      name: "Customers",
      href: "/admin/users",
      icon: Users,
      exact: false,
    },
    {
      name: "Drivers",
      href: "/admin/drivers",
      icon: UserCheck,
      exact: false,
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
      icon: MessageSquare,
      exact: false,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      exact: false,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      exact: false,
    },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-68 shrink-0 flex flex-col justify-between h-full bg-white border-r border-slate-200/80 p-5 select-none">
      <div className="space-y-6">
        {/* Brand Logo & Tagline */}
        <div className="px-2 pt-1">
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#101827] to-[#172033] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              R
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#172033] block leading-tight">
                Rent a Ride
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                Premium Mobility
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Operations & Fleet
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href, item.exact);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  active
                    ? "bg-[#101827] text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom promotional vehicle card */}
      <div className="pt-6 space-y-4 border-t border-slate-100">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#101827] to-[#172033] text-white p-4 shadow-sm border border-slate-800">
          <div className="relative z-10 space-y-2">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Fleet Expansion
            </span>
            <h4 className="font-bold text-xs text-white">
              Upgrade Tier 1 Fleet
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Add new luxury electric SUVs to meet weekend demand in UP hubs.
            </p>
            <Link
              href="/admin/cars/new"
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 pt-1"
            >
              <span>Add Vehicle</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Back to main website */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Customer Website</span>
          </span>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            Live
          </span>
        </Link>
      </div>
    </aside>
  );
}
