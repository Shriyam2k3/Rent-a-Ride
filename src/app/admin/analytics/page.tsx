"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Car,
  Users,
  DollarSign,
  CalendarCheck,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const kpis = [
    { label: "Fleet Utilization", value: "84.2%", change: "+5.1%", positive: true },
    { label: "Avg Rental Duration", value: "3.8 Days", change: "+0.4d", positive: true },
    { label: "Revenue per Vehicle", value: "₹48,200", change: "+12.3%", positive: true },
    { label: "Customer Repeat Rate", value: "32.6%", change: "+4.2%", positive: true },
  ];

  const cityPerformance = [
    { city: "Prayagraj Flagship Hub", bookings: 142, revenue: 642000, share: "45%" },
    { city: "Lucknow Gomti Nagar", bookings: 88, revenue: 396000, share: "28%" },
    { city: "Varanasi Airport Hub", bookings: 54, revenue: 243000, share: "17%" },
    { city: "Ayodhya Dham Station", bookings: 32, revenue: 144000, share: "10%" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#DDE6DF] inline-block mb-1">
            Business Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
            Fleet &amp; Revenue Analytics
          </h1>
          <p className="text-xs text-[#66736A] mt-1">
            Real-time utilization rates, regional revenue distribution, and growth trends across UP hubs.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-[#DDE6DF] p-1 rounded-xl shadow-xs text-xs font-semibold">
          {(["7d", "30d", "90d", "1y"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                period === p
                  ? "bg-[#173F2D] text-white font-extrabold shadow-sm"
                  : "text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#DDE6DF] rounded-2xl p-6 shadow-xs hover:border-[#173F2D]/40 transition-all space-y-2"
          >
            <span className="text-xs font-bold text-[#66736A] uppercase tracking-wider block">
              {kpi.label}
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
              {kpi.value}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#237447]">
              <span className="inline-flex items-center gap-0.5 text-[#237447] bg-[#EEF5EF] border border-[#DDE6DF] px-1.5 py-0.5 rounded text-[11px] font-bold">
                <TrendingUp className="w-3 h-3" />
                {kpi.change}
              </span>
              <span className="text-[#66736A] text-[11px]">vs previous cycle</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fleet Utilization by Category (Col 1-2) */}
        <div className="lg:col-span-2 bg-white border border-[#DDE6DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#18251D]">
                Fleet Utilization by Category
              </h3>
              <p className="text-xs text-[#66736A] mt-0.5">
                Active rental percentage by vehicle category
              </p>
            </div>
            <span className="text-xs font-bold text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-full border border-[#DDE6DF]">
              Optimal Fleet Capacity
            </span>
          </div>

          {/* Categorical Bar Chart representation */}
          <div className="space-y-4 pt-2">
            {[
              { category: "Luxury Sedans (BMW, Mercedes)", percent: 92, count: "11 of 12 rented" },
              { category: "Electric Vehicles (Tesla, Ioniq)", percent: 88, count: "7 of 8 rented" },
              { category: "Premium SUVs (Fortuner, Creta)", percent: 85, count: "17 of 20 rented" },
              { category: "Executive Sedans (City, Verna)", percent: 74, count: "14 of 19 rented" },
              { category: "Compact & Hatchbacks", percent: 65, count: "9 of 14 rented" },
            ].map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#18251D]">{cat.category}</span>
                  <span className="text-[#66736A]">{cat.count} ({cat.percent}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#F7FAF7] border border-[#DDE6DF] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#173F2D] transition-all duration-500"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Hub Breakdown (Col 3) */}
        <div className="bg-white border border-[#DDE6DF] rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#18251D]">
            Top UP Hubs by Revenue
          </h3>
          <p className="text-xs text-[#66736A]">
            Regional performance distribution
          </p>

          <div className="space-y-3 pt-2">
            {cityPerformance.map((city, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#F7FAF7] border border-[#DDE6DF] space-y-1 hover:border-[#173F2D]/30 transition-all"
              >
                <div className="flex justify-between text-xs font-bold text-[#18251D]">
                  <span>{city.city}</span>
                  <span className="text-[#173F2D]">{city.share}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#66736A]">
                  <span>{city.bookings} reservations</span>
                  <span className="font-semibold text-[#18251D]">
                    {formatCurrency(city.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
