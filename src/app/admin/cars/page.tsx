"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICar } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Car,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  Star,
  CheckCircle2,
  MapPin,
} from "lucide-react";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cars");
      if (res.ok) {
        const data = await res.json();
        setCars(data.cars || []);
      }
    } catch (e) {
      console.error("Failed to load cars:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the fleet?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCars((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert("Failed to delete car");
      }
    } catch (e) {
      alert("Error deleting car");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCars = cars.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.toLowerCase().includes(search.toLowerCase()) ||
      c.model.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "All" || c.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#DDE6DF] inline-block mb-1">
            Fleet Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
            Fleet Inventory Management
          </h1>
          <p className="text-xs text-[#66736A] mt-1">
            Manage your premium vehicles, rental rates, specifications, and availability across Prayagraj &amp; UP.
          </p>
        </div>

        <Link
          href="/admin/cars/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#DDE6DF] p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#66736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search make, model, or brand..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] text-xs text-[#18251D] placeholder:text-[#66736A] focus:outline-hidden focus:border-[#173F2D] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["All", "Electric", "SUV", "Sedan", "Luxury", "Sports"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                category === cat
                  ? "bg-[#173F2D] text-white font-extrabold shadow-sm"
                  : "bg-white border border-[#DDE6DF] text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Table / Grid */}
      <div className="bg-white border border-[#DDE6DF] rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#66736A]">
            <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
            <p className="text-xs font-medium text-[#66736A]">Loading fleet catalogue...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#66736A] space-y-3">
            <Car className="w-8 h-8 text-[#66736A] mx-auto" />
            <p className="font-semibold text-[#18251D]">No vehicles match your search filter.</p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="text-xs font-bold text-[#173F2D] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#18251D]">
              <thead className="bg-[#F7FAF7] text-[11px] uppercase tracking-wider text-[#66736A] font-semibold border-b border-[#DDE6DF]">
                <tr>
                  <th className="px-6 py-3.5">Vehicle</th>
                  <th className="px-6 py-3.5">Brand</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Daily Rate</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Station Hub</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE6DF] font-medium">
                {filteredCars.map((car) => (
                  <tr key={car._id} className="hover:bg-[#F7FAF7] transition-colors">
                    {/* Vehicle */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-11 rounded-xl bg-[#F7FAF7] overflow-hidden shrink-0 border border-[#DDE6DF]">
                          <Image
                            src={car.images?.[0] || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80"}
                            alt={car.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#18251D] line-clamp-1">{car.title}</p>
                          <p className="text-[11px] text-[#66736A]">
                            {car.year} • {car.transmission} • {car.fuelType}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4 font-bold text-[#18251D]">
                      {car.brand}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#EEF5EF] text-[#173F2D] uppercase tracking-wider border border-[#DDE6DF]">
                        {car.category}
                      </span>
                    </td>

                    {/* Daily Rate */}
                    <td className="px-6 py-4 font-extrabold text-[#18251D]">
                      {formatCurrency(car.dailyRate)}
                      <span className="text-[11px] font-normal text-[#66736A]"> /day</span>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-[#A86B18] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 w-fit">
                        <Star className="w-3 h-3 fill-[#A86B18] text-[#A86B18]" />
                        <span className="font-bold text-[11px]">{car.rating ? car.rating.toFixed(1) : "5.0"}</span>
                        <span className="text-[10px] text-[#66736A]">({car.reviewCount || 0})</span>
                      </div>
                    </td>

                    {/* Hub Location */}
                    <td className="px-6 py-4 text-[#18251D]">
                      <div className="flex items-center gap-1 truncate max-w-[140px]">
                        <MapPin className="w-3 h-3 text-[#173F2D] shrink-0" />
                        <span className="truncate">{car.location?.city || "Prayagraj"}</span>
                      </div>
                    </td>

                    {/* Availability */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF5EF] text-[#237447] border border-[#DDE6DF]">
                        <CheckCircle2 className="w-3 h-3 text-[#237447]" />
                        Available
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/cars/${car._id}`}
                          target="_blank"
                          title="View public details"
                          className="p-1.5 rounded-lg border border-[#DDE6DF] text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/cars/${car._id}/edit`}
                          title="Edit vehicle"
                          className="p-1.5 rounded-lg border border-[#DDE6DF] text-[#66736A] hover:text-[#173F2D] hover:bg-[#EEF5EF] transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(car._id, car.title)}
                          disabled={deletingId === car._id}
                          title="Delete vehicle"
                          className="p-1.5 rounded-lg border border-[#DDE6DF] text-[#66736A] hover:text-[#B42318] hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          {deletingId === car._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
