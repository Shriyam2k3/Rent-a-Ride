"use client";

import React from "react";
import { Search, RotateCcw, SlidersHorizontal, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface FilterState {
  search: string;
  category: string;
  brand: string;
  transmission: string;
  fuelType: string;
  seats?: string;
  availableOnly?: boolean;
  maxPrice: number;
  sortBy: string;
}

interface CarFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  availableBrands: string[];
}

export default function CarFilters({
  filters,
  onChange,
  onReset,
  availableBrands,
}: CarFiltersProps) {
  const categories = ["All", "Electric", "SUV", "Sedan", "Luxury", "Sports"];
  const transmissions = ["All", "Automatic", "Manual"];
  const fuelTypes = ["All", "Electric", "Petrol", "Hybrid"];
  const seatOptions = ["All", "4", "5"];

  return (
    <aside className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(16,24,39,0.02)] space-y-6">
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#101827]" />
          <h3 className="font-bold text-sm text-[#101827]">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#101827] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Keyword / Location Search */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
          Search Vehicles
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Model, make, or UP hub..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-[#172033] placeholder:text-[#94A3B8] focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
          />
        </div>
      </div>

      {/* 2. Car Type / Category */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
          Vehicle Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected =
              filters.category.toLowerCase() === cat.toLowerCase() ||
              (cat === "All" && (!filters.category || filters.category === "All"));

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ category: cat === "All" ? "" : cat })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#101827] text-white shadow-xs font-bold"
                    : "bg-slate-100 text-[#64748B] hover:bg-slate-200/70 hover:text-[#172033]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Max Price / Day
          </label>
          <span className="text-xs font-bold text-[#101827]">
            {formatCurrency(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={2000}
          max={25000}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#101827]"
        />
        <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
          <span>₹2,000</span>
          <span>₹25,000/day</span>
        </div>
      </div>

      {/* 4. Brand Filter */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
          Manufacturer / Brand
        </label>
        <select
          value={filters.brand || "All"}
          onChange={(e) => onChange({ brand: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#172033] bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
        >
          <option value="All">All Brands</option>
          {availableBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Transmission */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
          Transmission
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {transmissions.map((t) => {
            const isSelected =
              filters.transmission.toLowerCase() === t.toLowerCase() ||
              (t === "All" && (!filters.transmission || filters.transmission === "All"));
            return (
              <button
                key={t}
                type="button"
                onClick={() => onChange({ transmission: t === "All" ? "" : t })}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#101827] text-white font-bold"
                    : "bg-slate-100 text-[#64748B] hover:bg-slate-200/70"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Fuel Type */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
          Fuel / Energy
        </label>
        <div className="flex flex-wrap gap-1.5">
          {fuelTypes.map((f) => {
            const isSelected =
              filters.fuelType.toLowerCase() === f.toLowerCase() ||
              (f === "All" && (!filters.fuelType || filters.fuelType === "All"));
            return (
              <button
                key={f}
                type="button"
                onClick={() => onChange({ fuelType: f === "All" ? "" : f })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#101827] text-white font-bold"
                    : "bg-slate-100 text-[#64748B] hover:bg-slate-200/70"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Seats */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
          Passenger Seats
        </label>
        <div className="flex gap-2">
          {seatOptions.map((s) => {
            const isSelected =
              (filters.seats === s) ||
              (s === "All" && (!filters.seats || filters.seats === "All"));
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ seats: s === "All" ? "" : s })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#101827] text-white font-bold"
                    : "bg-slate-100 text-[#64748B] hover:bg-slate-200/70"
                }`}
              >
                {s === "All" ? "Any" : `${s} Seats`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Availability Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.availableOnly}
            onChange={(e) => onChange({ availableOnly: e.target.checked })}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600 cursor-pointer"
          />
          <span className="text-xs font-medium text-[#172033]">
            Available Now Only
          </span>
        </label>
      </div>
    </aside>
  );
}
