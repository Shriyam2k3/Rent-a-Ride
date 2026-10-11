"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
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
    <aside className="w-68 shrink-0 flex flex-col justify-between h-full bg-white border-r border-[#DDE6DF] p-5 select-none text-[#18251D]">
      <div className="space-y-6">
        {/* Brand Logo & Tagline */}
        <div className="px-2 pt-1">
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#173F2D] flex items-center justify-center text-white font-extrabold text-lg shadow-xs group-hover:scale-105 transition-transform">
              R
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#18251D] block leading-tight">
                Rent a Ride
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#173F2D]">
                Fleet Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#66736A] mb-2">
            Operations &amp; Fleet
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
                    ? "bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF] font-bold shadow-xs"
                    : "text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active
                        ? "text-[#173F2D]"
                        : "text-[#66736A] group-hover:text-[#18251D]"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#173F2D]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom promotional vehicle card */}
      <div className="pt-6 space-y-4 border-t border-[#DDE6DF]">
        <div className="relative rounded-2xl overflow-hidden bg-[#F7FAF7] text-[#18251D] p-4 border border-[#DDE6DF] shadow-xs">
          <div className="relative z-10 space-y-2">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF]">
              Fleet Expansion
            </span>
            <h4 className="font-bold text-xs text-[#18251D]">
              Upgrade Tier 1 Fleet
            </h4>
            <p className="text-[11px] text-[#66736A] leading-snug">
              Add new luxury electric SUVs to meet weekend demand in UP hubs.
            </p>
            <Link
              href="/admin/cars/new"
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#173F2D] hover:underline pt-1"
            >
              <span>Add Vehicle</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Back to main portal link */}
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#66736A] hover:text-[#18251D] rounded-xl hover:bg-[#F7FAF7] transition-colors"
        >
          <span>View Public Platform</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
