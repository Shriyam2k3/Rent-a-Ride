"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ICar } from "@/types";
import CarCard from "@/components/car-card";
import CarFilters from "@/components/car-filters";
import { Car, Loader2, RefreshCw, SlidersHorizontal } from "lucide-react";

function CarsListContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "All",
    brand: searchParams.get("brand") || "All",
    transmission: searchParams.get("transmission") || "All",
    fuelType: searchParams.get("fuelType") || "All",
    seats: "All",
    availableOnly: false,
    maxPrice: 25000,
    sortBy: "recommended",
  });

  const [cars, setCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category && filters.category !== "All") params.set("category", filters.category);
      if (filters.brand && filters.brand !== "All") params.set("brand", filters.brand);
      if (filters.transmission && filters.transmission !== "All") params.set("transmission", filters.transmission);
      if (filters.fuelType && filters.fuelType !== "All") params.set("fuelType", filters.fuelType);
      if (filters.maxPrice < 25000) params.set("maxPrice", filters.maxPrice.toString());
      if (filters.sortBy) params.set("sortBy", filters.sortBy);

      const res = await fetch(`/api/cars?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        let loaded = data.cars || [];

        // In-memory refinements for seats and availableOnly
        if (filters.seats && filters.seats !== "All") {
          loaded = loaded.filter((c: ICar) => c.seats === Number(filters.seats));
        }
        if (filters.availableOnly) {
          loaded = loaded.filter((c: ICar) => c.isAvailable === true);
        }

        setCars(loaded);
      }
    } catch (e) {
      console.error("Failed to fetch cars:", e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleFilterChange = (updated: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      category: "All",
      brand: "All",
      transmission: "All",
      fuelType: "All",
      seats: "All",
      availableOnly: false,
      maxPrice: 25000,
      sortBy: "recommended",
    });
  };

  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    cars.forEach((c) => {
      if (c.brand) brandsSet.add(c.brand);
    });
    ["Tesla", "BMW", "Porsche", "Audi", "Ford", "Toyota", "Mercedes-Benz", "Hyundai"].forEach((b) =>
      brandsSet.add(b)
    );
    return Array.from(brandsSet).sort();
  }, [cars]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-white text-[#18251D]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DDE6DF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#173F2D]">
            FLEET DISCOVERY & TELEMETRY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#18251D] mt-1">
            Available Rental Vehicles
          </h1>
          <p className="text-xs sm:text-sm text-[#66736A] mt-1 max-w-2xl">
            Browse through our verified protocol fleet across Prayagraj, Lucknow, and Varanasi hubs. Transparent rates with instant booking.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DDE6DF] text-xs font-bold text-[#18251D] shadow-xs cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#173F2D]" />
          <span>{mobileFilterOpen ? "Hide Filters" : "Show Filters"}</span>
        </button>
      </div>

      {/* 2-COLUMN DISCOVERY LAYOUT */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* LEFT: Filter Sidebar (Desktop Always, Mobile Toggle) */}
        <div className={`w-full lg:w-72 shrink-0 ${mobileFilterOpen ? "block" : "hidden lg:block"} sticky top-28`}>
          <CarFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            availableBrands={availableBrands}
          />
        </div>

        {/* RIGHT: Search & Sort Controls + Cars Grid */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-[#DDE6DF] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#18251D] text-sm">{cars.length}</span>
              <span className="text-[#66736A]">vehicles available</span>
              {filters.search && (
                <span className="px-2.5 py-0.5 rounded-md bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] font-medium">
                  for &ldquo;{filters.search}&rdquo;
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[#66736A]">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                  className="bg-[#F7FAF7] border border-[#DDE6DF] rounded-xl px-3 py-1.5 text-xs font-bold text-[#18251D] focus:outline-hidden focus:border-[#173F2D] cursor-pointer"
                >
                  <option value="recommended" className="bg-white text-[#18251D]">Recommended</option>
                  <option value="price-asc" className="bg-white text-[#18251D]">Price: Low to High</option>
                  <option value="price-desc" className="bg-white text-[#18251D]">Price: High to Low</option>
                  <option value="rating" className="bg-white text-[#18251D]">Highest Rated</option>
                </select>
              </div>

              <button
                type="button"
                onClick={fetchCars}
                title="Refresh list"
                className="p-2 rounded-xl border border-[#DDE6DF] hover:bg-[#F7FAF7] text-[#66736A] hover:text-[#18251D] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cars Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#66736A] gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
              <p className="text-xs font-semibold text-[#66736A]">Loading fleet inventory...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#DDE6DF] p-8 max-w-md mx-auto space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#EEF5EF] flex items-center justify-center mx-auto text-[#173F2D]">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#18251D]">No vehicles found</h3>
                <p className="text-xs text-[#66736A] mt-1">
                  Try adjusting or resetting your search filters to view more fleet options.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#173F2D] text-white rounded-xl text-xs font-bold hover:bg-[#2F7650] shadow-xs cursor-pointer transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#66736A]">Loading cars catalog...</div>}>
      <CarsListContent />
    </Suspense>
  );
}
