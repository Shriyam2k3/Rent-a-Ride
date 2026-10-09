"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  MessageSquare,
  PlusCircle,
  ArrowLeft,
  Shield,
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();
  const { user, mongoUser } = useAuth();
  const adminName = user?.displayName || mongoUser?.name || "Shriyam";

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Fleet Inventory", href: "/admin/cars", icon: Car },
    { name: "All Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Main Site
            </Link>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Admin Portal • {adminName}
            </span>
          </div>

          <Link
            href="/admin/cars/new"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs shadow-emerald-500/20 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add New Vehicle
          </Link>
        </div>

        {/* Tab navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 -mb-px">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
