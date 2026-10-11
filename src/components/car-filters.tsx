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
    <aside className="bg-white rounded-2xl border border-[#DDE6DF] p-6 shadow-xs space-y-6 text-[#18251D]">
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE6DF]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#173F2D]" />
          <h3 className="font-extrabold text-sm text-[#18251D]">Refine Fleet</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#66736A] hover:text-[#173F2D] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Keyword / Location Search */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#173F2D] mb-1.5">
          SEARCH VEHICLES
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#66736A]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Model, make, or UP hub..."
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-[#18251D] placeholder:text-[#66736A] focus:outline-hidden focus:border-[#173F2D] focus:ring-1 focus:ring-[#173F2D] transition-all"
          />
        </div>
      </div>

      {/* 2. Car Type / Category */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#173F2D] mb-2">
          VEHICLE CATEGORY
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#173F2D] text-white shadow-xs"
                    : "bg-[#F7FAF7] text-[#66736A] hover:bg-[#EEF5EF] hover:text-[#18251D] border border-[#DDE6DF]"
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
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#173F2D]">
            MAX PRICE / DAY
          </label>
          <span className="text-xs font-black text-[#18251D]">
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
          className="w-full h-1.5 bg-[#DDE6DF] rounded-lg appearance-none cursor-pointer accent-[#173F2D]"
        />
        <div className="flex justify-between text-[10px] text-[#66736A] mt-1 font-medium">
          <span>₹2,000</span>
          <span>₹25,000/day</span>
        </div>
      </div>

      {/* 4. Brand Filter */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#173F2D] mb-1.5">
          MANUFACTURER / BRAND
        </label>
        <select
          value={filters.brand || "All"}
          onChange={(e) => onChange({ brand: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl border border-[#DDE6DF] text-xs text-[#18251D] bg-[#F7FAF7] focus:outline-hidden focus:border-[#173F2D] cursor-pointer"
        >
          <option value="All" className="bg-white text-[#18251D]">All Brands</option>
          {availableBrands.map((b) => (
            <option key={b} value={b} className="bg-white text-[#18251D]">
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Transmission */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#173F2D] mb-2">
          TRANSMISSION
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
                className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#173F2D] text-white shadow-xs"
                    : "bg-[#F7FAF7] text-[#66736A] hover:bg-[#EEF5EF] hover:text-[#18251D] border border-[#DDE6DF]"
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
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#173F2D] mb-2">
          FUEL / ENERGY
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#173F2D] text-white shadow-xs"
                    : "bg-[#F7FAF7] text-[#66736A] hover:bg-[#EEF5EF] hover:text-[#18251D] border border-[#DDE6DF]"
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
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#173F2D] mb-2">
          PASSENGER SEATS
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
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#173F2D] text-white shadow-xs"
                    : "bg-[#F7FAF7] text-[#66736A] hover:bg-[#EEF5EF] hover:text-[#18251D] border border-[#DDE6DF]"
                }`}
              >
                {s === "All" ? "Any" : `${s} Seats`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Availability Toggle */}
      <div className="pt-3 border-t border-[#DDE6DF]">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.availableOnly}
            onChange={(e) => onChange({ availableOnly: e.target.checked })}
            className="w-4 h-4 rounded text-[#173F2D] focus:ring-[#173F2D] border-[#DDE6DF] bg-white accent-[#173F2D] cursor-pointer"
          />
          <span className="text-xs font-semibold text-[#18251D]">
            Available Now Only
          </span>
        </label>
      </div>
    </aside>
  );
}
