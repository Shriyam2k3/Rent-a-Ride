"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import {
  DollarSign,
  Car,
  CalendarCheck,
  Users,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { IBooking } from "@/types";

interface AdminStatsData {
  totalRevenue: number;
  activeBookings: number;
  totalCars: number;
  totalUsers: number;
  recentBookings: IBooking[];
  popularCars: {
    title: string;
    image: string;
    count: number;
    revenue: number;
  }[];
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartTimeframe, setChartTimeframe] = useState<"week" | "month" | "year">("month");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json.stats);
      }
    } catch (e) {
      console.error("Failed to load admin stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Simulated recent activity logs
  const recentActivities = [
    {
      id: "act-1",
      user: "Aarav Sharma",
      action: "Reserved BMW 3 Series for 4 days",
      time: "12 mins ago",
      icon: CalendarCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "act-2",
      user: "Priya Patel",
      action: "Completed rental & left a 5-star review",
      time: "1 hour ago",
      icon: ShieldCheck,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "act-3",
      user: "Fleet Operations",
      action: "Dispatched Hyundai Creta to Prayagraj Airport",
      time: "3 hours ago",
      icon: Car,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: "act-4",
      user: "Rohan Verma",
      action: "Registered new verified driver profile",
      time: "5 hours ago",
      icon: Users,
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Welcome back, Shriyam!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here&apos;s what&apos;s happening with your fleet across Prayagraj and Uttar Pradesh today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Refresh telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/cars/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#101827] hover:bg-[#172033] text-white font-bold text-xs shadow-sm transition-all hover:shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Add Vehicle</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-xs font-medium text-slate-500">Loading fleet telemetry...</p>
        </div>
      ) : !data ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200 p-8">
          Failed to load platform stats. Please check database connectivity.
        </div>
      ) : (
        <>
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Revenue */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Revenue
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                {formatCurrency(data.totalRevenue)}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
                <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                  <TrendingUp className="w-3 h-3" />
                  +18.4%
                </span>
                <span className="text-slate-400 text-[11px]">vs last month</span>
              </div>
            </div>

            {/* Active Bookings */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Bookings
                </span>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-2xs">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                {data.activeBookings}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-teal-700">
                <span className="inline-flex items-center gap-0.5 text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
                <span className="text-slate-400 text-[11px]">Currently dispatched</span>
              </div>
            </div>

            {/* Fleet Inventory */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Fleet Inventory
                </span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#172033] flex items-center justify-center shadow-2xs">
                  <Car className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                {data.totalCars}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-600">
                <span className="text-[11px] text-slate-500">Available across UP Hubs</span>
              </div>
            </div>

            {/* Registered Drivers */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Registered Drivers
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                {data.totalUsers}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-700">
                <span className="inline-flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                  Verified
                </span>
                <span className="text-slate-400 text-[11px]">KYC verified renters</span>
              </div>
            </div>
          </div>

          {/* Revenue Overview Line/Area Chart Component */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Financial Performance
                </span>
                <h3 className="text-xl font-extrabold text-[#172033] mt-0.5">
                  Revenue Overview
                </h3>
                <p className="text-xs text-slate-500">
                  Monthly platform earnings, booking deposits, and tax collections.
                </p>
              </div>

              {/* Timeframe pill selectors */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(["week", "month", "year"] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setChartTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                      chartTimeframe === tf
                        ? "bg-white text-[#172033] font-bold shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Interactive-style Area Chart */}
            <div className="relative pt-4">
              <div className="h-64 w-full">
                <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="40" y1="30" x2="780" y2="30" stroke="#E2E8F0" strokeDasharray="4 4" />
                  <line x1="40" y1="90" x2="780" y2="90" stroke="#E2E8F0" strokeDasharray="4 4" />
                  <line x1="40" y1="150" x2="780" y2="150" stroke="#E2E8F0" strokeDasharray="4 4" />
                  <line x1="40" y1="210" x2="780" y2="210" stroke="#E2E8F0" />

                  {/* Y Axis Labels */}
                  <text x="30" y="34" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">₹1.5L</text>
                  <text x="30" y="94" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">₹1.0L</text>
                  <text x="30" y="154" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">₹50K</text>
                  <text x="30" y="214" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">₹0</text>

                  {/* Shaded Area */}
                  <path
                    d="M 60,185 C 130,170 180,120 240,140 C 310,165 370,80 440,95 C 510,110 560,50 630,65 C 700,80 740,40 760,35 L 760,210 L 60,210 Z"
                    fill="url(#revenueGradient)"
                  />

                  {/* Line Stroke */}
                  <path
                    d="M 60,185 C 130,170 180,120 240,140 C 310,165 370,80 440,95 C 510,110 560,50 630,65 C 700,80 740,40 760,35"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data points */}
                  {[
                    { cx: 60, cy: 185 },
                    { cx: 150, cy: 155 },
                    { cx: 240, cy: 140 },
                    { cx: 340, cy: 110 },
                    { cx: 440, cy: 95 },
                    { cx: 530, cy: 80 },
                    { cx: 630, cy: 65 },
                    { cx: 760, cy: 35 },
                  ].map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.cx}
                      cy={pt.cy}
                      r="4"
                      className="fill-white stroke-emerald-600 stroke-2 hover:r-6 transition-all cursor-pointer"
                    />
                  ))}
                </svg>
              </div>

              {/* X Axis Month Labels */}
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 px-6">
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </div>

          {/* Grid: Latest Platform Bookings (Col 1-2) + Right Column (Col 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Latest Platform Bookings Table */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#172033]">
                      Latest Platform Bookings
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Incoming reservations and trip statuses across all UP locations.
                    </p>
                  </div>
                  <Link
                    href="/admin/bookings"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200/80">
                      <tr>
                        <th className="px-6 py-3.5">Ref ID</th>
                        <th className="px-6 py-3.5">Customer</th>
                        <th className="px-6 py-3.5">Vehicle</th>
                        <th className="px-6 py-3.5">Schedule</th>
                        <th className="px-6 py-3.5">Amount</th>
                        <th className="px-6 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {data.recentBookings.map((b) => {
                        const badge = getStatusBadge(b.status);
                        return (
                          <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-4 font-mono font-bold text-[#172033]">
                              <Link
                                href={`/admin/bookings/${b._id}`}
                                className="hover:text-emerald-600 transition-colors"
                              >
                                {b.bookingCode}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-[#172033]">{b.user?.name}</p>
                              <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                                {b.user?.email}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-slate-800 font-semibold">
                              <div className="flex items-center gap-2.5">
                                <div className="relative w-9 h-6 rounded bg-slate-100 overflow-hidden shrink-0">
                                  <Image
                                    src={b.car?.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80"}
                                    alt="car"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="truncate max-w-[140px]">{b.car?.title}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                              {formatDate(b.startDate)}
                            </td>
                            <td className="px-6 py-4 font-extrabold text-[#172033]">
                              {formatCurrency(b.totalAmount)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                                {badge.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 text-right bg-slate-50/50">
                <Link
                  href="/admin/bookings"
                  className="text-xs font-bold text-slate-600 hover:text-emerald-600 inline-flex items-center gap-1"
                >
                  <span>Go to Booking Management Console</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Most Rented Models & Recent Activity */}
            <div className="space-y-8">
              {/* Most Rented Models */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-[#172033]">
                    Most Rented Models
                  </h3>
                  <Link
                    href="/admin/cars"
                    className="text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    Manage
                  </Link>
                </div>

                <div className="space-y-3">
                  {data.popularCars.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-9 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-200/60">
                          <Image
                            src={p.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80"}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-[#172033] truncate">{p.title}</p>
                          <p className="text-[11px] text-slate-500">{p.count} total bookings</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-xs text-emerald-600 shrink-0">
                        {formatCurrency(p.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-[#172033]">
                    Recent Activity
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">Real-time</span>
                </div>

                <div className="space-y-3.5">
                  {recentActivities.map((act) => {
                    const Icon = act.icon;
                    return (
                      <div key={act.id} className="flex items-start gap-3 text-xs">
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${act.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#172033] leading-snug">
                            {act.user}
                          </p>
                          <p className="text-slate-500 text-[11px] leading-tight">
                            {act.action}
                          </p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {act.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
