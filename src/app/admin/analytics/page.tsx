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
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1">
            Business Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Fleet & Revenue Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time utilization rates, regional revenue distribution, and growth trends across UP hubs.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 p-1 rounded-xl shadow-xs text-xs font-semibold">
          {(["7d", "30d", "90d", "1y"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                period === p
                  ? "bg-[#101827] text-white font-bold"
                  : "text-slate-500 hover:text-slate-800"
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
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-2"
          >
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {kpi.label}
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              {kpi.value}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                <TrendingUp className="w-3 h-3" />
                {kpi.change}
              </span>
              <span className="text-slate-400 text-[11px]">vs previous cycle</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fleet Utilization by Category (Col 1-2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#172033]">
                Fleet Utilization by Category
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active rental percentage by vehicle category
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
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
                  <span className="text-[#172033]">{cat.category}</span>
                  <span className="text-slate-500">{cat.count} ({cat.percent}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Hub Breakdown (Col 3) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#172033]">
            Top UP Hubs by Revenue
          </h3>
          <p className="text-xs text-slate-500">
            Regional performance distribution
          </p>

          <div className="space-y-3 pt-2">
            {cityPerformance.map((city, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1"
              >
                <div className="flex justify-between text-xs font-bold text-[#172033]">
                  <span>{city.city}</span>
                  <span className="text-emerald-600">{city.share}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{city.bookings} reservations</span>
                  <span className="font-semibold text-slate-800">
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
