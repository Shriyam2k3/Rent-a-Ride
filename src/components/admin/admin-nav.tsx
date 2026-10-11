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
  const adminName = user?.displayName || mongoUser?.name || "Admin";

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Fleet Inventory", href: "/admin/cars", icon: Car },
    { name: "All Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  ];

  return (
    <div className="bg-white border-b border-[#DDE6DF] text-[#18251D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-[#66736A] hover:text-[#18251D] flex items-center gap-1 bg-[#F7FAF7] hover:bg-[#EEF5EF] px-2.5 py-1.5 rounded-lg border border-[#DDE6DF] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Main Site
            </Link>
            <div className="h-4 w-px bg-[#DDE6DF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#DDE6DF] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Admin Portal • {adminName}
            </span>
          </div>

          <Link
            href="/admin/cars/new"
            className="inline-flex items-center gap-1.5 bg-[#173F2D] hover:bg-[#2F7650] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all"
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
                    ? "bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF] font-bold"
                    : "text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7]"
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
