"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Save, Car } from "lucide-react";
import { ICar } from "@/types";

export default function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: 2024,
    category: "SUV",
    dailyRate: 4500,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    doors: 4,
    mileage: "Unlimited",
    imageUrl: "",
    city: "Prayagraj",
    address: "",
    description: "",
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/cars/${id}`);
        if (res.ok) {
          const data = await res.json();
          const car: ICar = data.car;
          setFormData({
            title: car.title,
            brand: car.brand,
            model: car.model,
            year: car.year,
            category: car.category,
            dailyRate: car.dailyRate,
            fuelType: car.fuelType,
            transmission: car.transmission,
            seats: car.seats,
            doors: car.doors,
            mileage: car.mileage,
            imageUrl: car.images?.[0] || "",
            city: car.location?.city || "Prayagraj",
            address: car.location?.address || "",
            description: car.description,
          });
        }
      } catch (e) {
        console.error("Failed to load car:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          brand: formData.brand,
          model: formData.model,
          year: Number(formData.year),
          category: formData.category,
          dailyRate: Number(formData.dailyRate),
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          seats: Number(formData.seats),
          doors: Number(formData.doors),
          mileage: formData.mileage,
          images: formData.imageUrl ? [formData.imageUrl] : undefined,
          location: {
            city: formData.city,
            address: formData.address,
          },
          description: formData.description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update car");
      }

      router.push("/admin/cars");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Update failed");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#66736A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
        <p className="text-xs font-medium text-[#66736A]">Loading vehicle details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/cars"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66736A] hover:text-[#18251D] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fleet Directory</span>
      </Link>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#DDE6DF] inline-block mb-1">
          Fleet Editor
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
          Edit Vehicle Details
        </h1>
        <p className="text-xs text-[#66736A] mt-1">
          Update specifications, rental rates, and station assignments for {formData.title}.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-[#B42318] text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#DDE6DF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
              Make / Brand
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
              Model
            </label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
              Year
            </label>
            <input
              type="number"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
            Listing Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
            >
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Electric">Electric</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
              Daily Rate (₹ INR)
            </label>
            <input
              type="number"
              required
              value={formData.dailyRate}
              onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
              Transmission
            </label>
            <select
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
          />
          {formData.imageUrl && (
            <div className="mt-3 relative w-40 h-28 rounded-2xl overflow-hidden bg-[#F7FAF7] border border-[#DDE6DF]">
              <Image src={formData.imageUrl} alt="Car" fill className="object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
            Marketing Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D] resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDE6DF]">
          <Link
            href="/admin/cars"
            className="px-5 py-2.5 rounded-xl border border-[#DDE6DF] text-xs font-bold text-[#66736A] hover:bg-[#F7FAF7]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4 text-white" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
