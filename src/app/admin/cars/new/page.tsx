"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Loader2,
  Plus,
  Car,
  Fuel,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  ListPlus,
} from "lucide-react";

export default function NewCarPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    category: "SUV",
    dailyRate: 4500,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    doors: 4,
    mileage: "Unlimited",
    features: "Apple CarPlay, Bluetooth 5.0, Backup Camera, Cruise Control, Leather Seats, Sunroof",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    city: "Prayagraj",
    address: "Civil Lines Hub & MG Marg, Prayagraj",
    description: "Exceptional comfort, precision German engineering, flawless maintenance, and top-tier highway performance for UP expressways.",
  });

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        setFormData((prev) => ({ ...prev, imageUrl: json.url }));
      } else {
        alert("Image upload failed, using current photo URL");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const featuresArray = formData.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title || `${formData.brand} ${formData.model}`,
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
          features: featuresArray,
          images: [formData.imageUrl],
          location: {
            city: formData.city,
            address: formData.address,
          },
          description: formData.description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create car");
      }

      router.push("/admin/cars");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <Link
        href="/admin/cars"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fleet Directory</span>
      </Link>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1">
          Inventory Expansion
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
          Register New Vehicle
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Add a new automobile to the Rent-a-Ride fleet with specifications, pricing in ₹ INR, and high-res photos.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Multi-section Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">1. Basic Vehicle Identification</h3>
              <p className="text-[11px] text-slate-400">Make, model, year, and customer-facing title</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Manufacturer / Brand *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. BMW, Mercedes, Tata"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Model Name *
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. 3 Series, Safari, Harrier"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Year of Production *
              </label>
              <input
                type="number"
                required
                min="2018"
                max="2026"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Full Listing Title (Auto-generated if blank)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. BMW 3 Series 330i M Sport (2024)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Section 2: Category & Pricing */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">2. Category & Pricing</h3>
              <p className="text-[11px] text-slate-400">Rental rate per day in Indian Rupee and car segment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Vehicle Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600 bg-white"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Daily Rate (₹ INR) *
              </label>
              <input
                type="number"
                required
                min="500"
                value={formData.dailyRate}
                onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Transmission *
              </label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600 bg-white"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Specifications */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">3. Specifications & Passenger Capacity</h3>
              <p className="text-[11px] text-slate-400">Fuel type, seats, doors, and mileage allowances</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Fuel / Energy Type
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600 bg-white"
              >
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Seat Capacity
              </label>
              <input
                type="number"
                min="2"
                max="9"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Number of Doors
              </label>
              <input
                type="number"
                min="2"
                max="5"
                value={formData.doors}
                onChange={(e) => setFormData({ ...formData, doors: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Kilometer Limit
              </label>
              <input
                type="text"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Location Station */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">4. Station Hub & Location</h3>
              <p className="text-[11px] text-slate-400">Prayagraj & Uttar Pradesh operational hubs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Station City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Prayagraj, Lucknow, Varanasi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Pickup Address / Hub Location *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Civil Lines Hub, Prayagraj Junction, Bamrauli Airport"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Media & Photos */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">5. High-Resolution Vehicle Photo</h3>
              <p className="text-[11px] text-slate-400">Upload to Cloudinary or specify direct automotive image URL</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
            />

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shrink-0 transition-colors">
              {uploadingImage ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              ) : (
                <Upload className="w-4 h-4 text-emerald-600" />
              )}
              <span>Upload Image File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>
          </div>

          {formData.imageUrl && (
            <div className="mt-3 relative w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
              <Image
                src={formData.imageUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Section 6: Features & Description */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <ListPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">6. Features & Highlights</h3>
              <p className="text-[11px] text-slate-400">Equipment checklist and vehicle profile</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Included Equipment (Comma separated)
            </label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Vehicle Overview / Marketing Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#172033] focus:outline-hidden focus:border-emerald-600 resize-none"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/cars"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="px-6 py-2.5 rounded-xl bg-[#101827] hover:bg-[#172033] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <Plus className="w-4 h-4 text-emerald-400" />
            )}
            <span>Publish Vehicle to Fleet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
