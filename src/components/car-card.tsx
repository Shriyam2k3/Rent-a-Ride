import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ICar } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Star, ArrowRight, ShieldCheck } from "lucide-react";

interface CarCardProps {
  car: ICar;
}

export default function CarCard({ car }: CarCardProps) {
  const primaryImage =
    car.images?.[0] ||
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-xs hover:shadow-md hover:border-[#CAD7CC] transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Vehicle Image Container */}
      <div className="relative w-full h-56 bg-[#F7FAF7] overflow-hidden">
        <Image
          src={primaryImage}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md border border-[#DDE6DF] text-[#173F2D] shadow-xs">
            {car.category}
          </span>
          {car.isAvailable ? (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#237447] text-white flex items-center gap-1.5 shadow-xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              Available
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/80 backdrop-blur-md text-[#66736A] border border-[#DDE6DF]">
              Reserved
            </span>
          )}
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/90 backdrop-blur-md border border-[#DDE6DF] text-[#18251D] shadow-xs">
            {car.year}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Brand & Name + Rating */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#173F2D]">
                {car.brand}
              </p>
              <h3 className="font-extrabold text-base sm:text-lg text-[#18251D] group-hover:text-[#173F2D] transition-colors line-clamp-1">
                {car.title || `${car.brand} ${car.model}`}
              </h3>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-[#EEF5EF] px-2 py-1 rounded-lg border border-[#DDE6DF] shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#A86B18] text-[#A86B18]" />
              <span className="text-xs font-bold text-[#18251D]">
                {car.rating ? car.rating.toFixed(1) : "4.9"}
              </span>
            </div>
          </div>

          {/* Telemetry Specs Bento Pills */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="p-2 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] text-center">
              <span className="text-[9px] uppercase font-bold text-[#66736A] block">Fuel</span>
              <span className="text-xs font-semibold text-[#18251D] truncate block mt-0.5">
                {car.fuelType}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] text-center">
              <span className="text-[9px] uppercase font-bold text-[#66736A] block">Gearbox</span>
              <span className="text-xs font-semibold text-[#18251D] truncate block mt-0.5">
                {car.transmission}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] text-center">
              <span className="text-[9px] uppercase font-bold text-[#66736A] block">Seats</span>
              <span className="text-xs font-semibold text-[#18251D] truncate block mt-0.5">
                {car.seats} Seats
              </span>
            </div>
          </div>

          {/* Location snippet */}
          {car.location?.city && (
            <p className="text-[11px] text-[#66736A] flex items-center gap-1 truncate pt-0.5 font-medium">
              <span className="text-[#173F2D]">📍</span> {car.location.city} • {car.location.address}
            </p>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[#DDE6DF]">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-[#18251D] tracking-tight">
                {formatCurrency(car.dailyRate)}
              </span>
              <span className="text-xs font-medium text-[#66736A]">/ day</span>
            </div>
            <span className="text-[10px] text-[#237447] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 inline text-[#237447]" />
              Zero deposit with Fast KYC
            </span>
          </div>

          <Link
            href={`/cars/${car._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#173F2D] hover:bg-[#2F7650] text-white shadow-xs transition-all group/btn cursor-pointer"
          >
            <span>Reserve</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
