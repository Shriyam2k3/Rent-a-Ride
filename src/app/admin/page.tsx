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
    },
    {
      id: "act-2",
      user: "Priya Patel",
      action: "Completed rental & left a 5-star review",
      time: "1 hour ago",
      icon: ShieldCheck,
    },
    {
      id: "act-3",
      user: "Fleet Operations",
      action: "Dispatched Hyundai Creta to Prayagraj Airport",
      time: "3 hours ago",
      icon: Car,
    },
    {
      id: "act-4",
      user: "Rohan Verma",
      action: "Registered new verified driver profile",
      time: "5 hours ago",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8 text-[#18251D]">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DDE6DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#DDE6DF] inline-flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#237447] animate-pulse" />
            Live Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
            Welcome back, Shriyam!
          </h1>
          <p className="text-xs sm:text-sm text-[#66736A] mt-1">
            Here&apos;s what&apos;s happening with your fleet across Prayagraj and Uttar Pradesh today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl border border-[#DDE6DF] bg-white hover:bg-[#F7FAF7] text-[#66736A] hover:text-[#18251D] transition-colors cursor-pointer"
            title="Refresh telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/cars/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Add Vehicle</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#66736A]">
          <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
          <p className="text-xs font-medium text-[#66736A]">Loading fleet telemetry...</p>
        </div>
      ) : !data ? (
        <div className="text-center py-20 text-[#66736A] bg-white rounded-2xl border border-[#DDE6DF] p-8 shadow-xs">
          Failed to load platform stats. Please check database connectivity.
        </div>
      ) : (
        <>
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Revenue */}
            <div className="bg-white border border-[#DDE6DF] rounded-2xl p-6 shadow-xs hover:border-[#CAD7CC] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#66736A] uppercase tracking-wider">
                  Total Revenue
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center shadow-xs">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
                {formatCurrency(data.totalRevenue)}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#237447]">
                <span className="inline-flex items-center gap-0.5 text-[#237447] bg-[#EEF5EF] border border-[#DDE6DF] px-1.5 py-0.5 rounded text-[11px] font-bold">
                  <TrendingUp className="w-3 h-3" />
                  +18.4%
                </span>
                <span className="text-[#66736A] text-[11px]">vs last month</span>
              </div>
            </div>

            {/* Active Bookings */}
            <div className="bg-white border border-[#DDE6DF] rounded-2xl p-6 shadow-xs hover:border-[#CAD7CC] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#66736A] uppercase tracking-wider">
                  Active Bookings
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center shadow-xs">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
                {data.activeBookings}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#237447]">
                <span className="inline-flex items-center gap-0.5 text-[#237447] bg-[#EEF5EF] border border-[#DDE6DF] px-1.5 py-0.5 rounded text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
                <span className="text-[#66736A] text-[11px]">Currently dispatched</span>
              </div>
            </div>

            {/* Fleet Inventory */}
            <div className="bg-white border border-[#DDE6DF] rounded-2xl p-6 shadow-xs hover:border-[#CAD7CC] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#66736A] uppercase tracking-wider">
                  Fleet Inventory
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center shadow-xs">
                  <Car className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
                {data.totalCars}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#66736A]">
                <span className="text-[11px] text-[#66736A]">Available across UP Hubs</span>
              </div>
            </div>

            {/* Registered Drivers */}
            <div className="bg-white border border-[#DDE6DF] rounded-2xl p-6 shadow-xs hover:border-[#CAD7CC] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#66736A] uppercase tracking-wider">
                  Registered Drivers
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
                {data.totalUsers}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#A86B18]">
                <span className="inline-flex items-center gap-0.5 text-[#A86B18] bg-[#F7FAF7] border border-[#DDE6DF] px-1.5 py-0.5 rounded text-[11px] font-bold">
                  Verified
                </span>
                <span className="text-[#66736A] text-[11px]">KYC verified renters</span>
              </div>
            </div>
          </div>

          {/* Revenue Overview Line/Area Chart Component */}
          <div className="bg-white border border-[#DDE6DF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D]">
                  Financial Performance
                </span>
                <h3 className="text-xl font-extrabold text-[#18251D] mt-0.5">
                  Revenue Overview
                </h3>
                <p className="text-xs text-[#66736A]">
                  Monthly platform earnings, booking deposits, and tax collections.
                </p>
              </div>

              {/* Timeframe pill selectors */}
              <div className="flex items-center gap-1.5 bg-[#F7FAF7] border border-[#DDE6DF] p-1 rounded-xl text-xs font-semibold">
                {(["week", "month", "year"] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setChartTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                      chartTimeframe === tf
                        ? "bg-[#173F2D] text-white font-bold shadow-xs"
                        : "text-[#66736A] hover:text-[#18251D]"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Interactive-style Area Chart with Sage background */}
            <div className="relative pt-4">
              <div className="h-64 w-full bg-[#F7FAF7] rounded-xl p-3 border border-[#DDE6DF]">
                <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#173F2D" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#173F2D" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="40" y1="30" x2="780" y2="30" stroke="#DDE6DF" strokeDasharray="4 4" />
                  <line x1="40" y1="90" x2="780" y2="90" stroke="#DDE6DF" strokeDasharray="4 4" />
                  <line x1="40" y1="150" x2="780" y2="150" stroke="#DDE6DF" strokeDasharray="4 4" />
                  <line x1="40" y1="210" x2="780" y2="210" stroke="#CAD7CC" />

                  {/* Y Axis Labels */}
                  <text x="30" y="34" textAnchor="end" className="text-[10px] fill-[#66736A] font-mono">₹1.5L</text>
                  <text x="30" y="94" textAnchor="end" className="text-[10px] fill-[#66736A] font-mono">₹1.0L</text>
                  <text x="30" y="154" textAnchor="end" className="text-[10px] fill-[#66736A] font-mono">₹50K</text>
                  <text x="30" y="214" textAnchor="end" className="text-[10px] fill-[#66736A] font-mono">₹0</text>

                  {/* Shaded Area */}
                  <path
                    d="M 60,185 C 130,170 180,120 240,140 C 310,165 370,80 440,95 C 510,110 560,50 630,65 C 700,80 740,40 760,35 L 760,210 L 60,210 Z"
                    fill="url(#revenueGradient)"
                  />

                  {/* Line Stroke */}
                  <path
                    d="M 60,185 C 130,170 180,120 240,140 C 310,165 370,80 440,95 C 510,110 560,50 630,65 C 700,80 740,40 760,35"
                    fill="none"
                    stroke="#173F2D"
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
                      className="fill-white stroke-[#173F2D] stroke-2 hover:r-6 transition-all cursor-pointer"
                    />
                  ))}
                </svg>
              </div>

              {/* X Axis Month Labels */}
              <div className="flex justify-between text-[11px] font-semibold text-[#66736A] pt-2 px-6">
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
            <div className="lg:col-span-2 bg-white border border-[#DDE6DF] rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-6 border-b border-[#DDE6DF] flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#18251D]">
                      Latest Platform Bookings
                    </h3>
                    <p className="text-xs text-[#66736A] mt-0.5">
                      Incoming reservations and trip statuses across all UP locations.
                    </p>
                  </div>
                  <Link
                    href="/admin/bookings"
                    className="text-xs font-bold text-[#173F2D] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#18251D]">
                    <thead className="bg-[#F7FAF7] text-[11px] uppercase tracking-wider text-[#66736A] font-semibold border-b border-[#DDE6DF]">
                      <tr>
                        <th className="px-6 py-3.5">Ref ID</th>
                        <th className="px-6 py-3.5">Customer</th>
                        <th className="px-6 py-3.5">Vehicle</th>
                        <th className="px-6 py-3.5">Schedule</th>
                        <th className="px-6 py-3.5">Amount</th>
                        <th className="px-6 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDE6DF] font-medium">
                      {data.recentBookings.map((b) => {
                        const badge = getStatusBadge(b.status);
                        return (
                          <tr key={b._id} className="hover:bg-[#F7FAF7] transition-colors">
                            <td className="px-6 py-4 font-mono font-bold text-[#18251D]">
                              <Link
                                href={`/admin/bookings/${b._id}`}
                                className="hover:text-[#173F2D] transition-colors"
                              >
                                {b.bookingCode}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-[#18251D]">{b.user?.name}</p>
                              <p className="text-[11px] text-[#66736A] truncate max-w-[130px]">
                                {b.user?.email}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-[#18251D] font-semibold">
                              <div className="flex items-center gap-2.5">
                                <div className="relative w-9 h-6 rounded bg-[#F7FAF7] overflow-hidden shrink-0 border border-[#DDE6DF]">
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
                            <td className="px-6 py-4 text-[#66736A] whitespace-nowrap">
                              {formatDate(b.startDate)}
                            </td>
                            <td className="px-6 py-4 font-extrabold text-[#18251D]">
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

              <div className="p-4 border-t border-[#DDE6DF] text-right bg-[#F7FAF7]">
                <Link
                  href="/admin/bookings"
                  className="text-xs font-bold text-[#66736A] hover:text-[#173F2D] inline-flex items-center gap-1"
                >
                  <span>Go to Booking Management Console</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Most Rented Models & Recent Activity */}
            <div className="space-y-8">
              {/* Most Rented Models */}
              <div className="bg-white border border-[#DDE6DF] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DDE6DF]">
                  <h3 className="font-extrabold text-sm text-[#18251D]">
                    Most Rented Models
                  </h3>
                  <Link
                    href="/admin/cars"
                    className="text-[11px] font-bold text-[#173F2D] hover:underline"
                  >
                    Manage
                  </Link>
                </div>

                <div className="space-y-3">
                  {data.popularCars.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] flex items-center justify-between gap-3 hover:border-[#CAD7CC] transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-9 rounded-xl bg-white overflow-hidden shrink-0 border border-[#DDE6DF]">
                          <Image
                            src={p.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80"}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-[#18251D] truncate">{p.title}</p>
                          <p className="text-[11px] text-[#66736A]">{p.count} total bookings</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-xs text-[#173F2D] shrink-0">
                        {formatCurrency(p.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white border border-[#DDE6DF] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DDE6DF]">
                  <h3 className="font-extrabold text-sm text-[#18251D]">
                    Recent Activity
                  </h3>
                  <span className="text-[11px] font-semibold text-[#66736A]">Real-time</span>
                </div>

                <div className="space-y-3.5">
                  {recentActivities.map((act) => {
                    const Icon = act.icon;
                    return (
                      <div key={act.id} className="flex items-start gap-3 text-xs">
                        <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D]">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#18251D] leading-snug">
                            {act.user}
                          </p>
                          <p className="text-[#66736A] text-[11px] leading-tight">
                            {act.action}
                          </p>
                          <span className="text-[10px] text-[#66736A] flex items-center gap-1 mt-0.5">
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
