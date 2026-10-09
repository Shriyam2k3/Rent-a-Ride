import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ICar } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";

interface CarCardProps {
  car: ICar;
}

export default function CarCard({ car }: CarCardProps) {
  const primaryImage =
    car.images?.[0] ||
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(16,24,39,0.03)] hover:shadow-[0_12px_28px_rgba(16,24,39,0.07)] hover:border-slate-300/80 transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Vehicle Image Container */}
      <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
        <Image
          src={primaryImage}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#101827]/85 backdrop-blur-xs text-white">
            {car.category}
          </span>
          {car.isAvailable ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Available
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
              Reserved
            </span>
          )}
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 backdrop-blur-xs text-[#172033] shadow-xs">
            {car.year}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Brand & Name + Rating */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                {car.brand}
              </p>
              <h3 className="font-bold text-base sm:text-lg text-[#172033] group-hover:text-emerald-600 transition-colors line-clamp-1">
                {car.title || `${car.brand} ${car.model}`}
              </h3>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-[#172033]">
                {car.rating ? car.rating.toFixed(1) : "4.9"}
              </span>
            </div>
          </div>

          {/* Clean Specs String: Automatic • Petrol • 5 Seats */}
          <p className="text-xs text-[#64748B] flex items-center gap-1.5 pt-1">
            <span>{car.transmission}</span>
            <span className="text-slate-300">•</span>
            <span>{car.fuelType}</span>
            <span className="text-slate-300">•</span>
            <span>{car.seats} Seats</span>
          </p>

          {/* Location snippet */}
          {car.location?.city && (
            <p className="text-[11px] text-[#94A3B8] truncate">
              📍 {car.location.city} • {car.location.address}
            </p>
          )}
        </div>

        {/* Price & View Details Action */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-[#101827]">
                {formatCurrency(car.dailyRate)}
              </span>
              <span className="text-xs font-medium text-[#64748B]">/ day</span>
            </div>
            <span className="text-[10px] text-[#94A3B8] block">Inclusive of GST</span>
          </div>

          <Link
            href={`/cars/${car._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#101827] text-white hover:bg-[#172033] hover:shadow-xs transition-all group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
