"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { IBooking } from "@/types";
import LiveTripTracker from "@/components/live-trip-tracker";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Car,
  ShieldCheck,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function DedicatedTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data.booking);
        }
      } catch (e) {
        console.error("Failed to load tracking data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-[#66736A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
        <p className="text-xs font-semibold text-[#66736A]">
          Connecting to Real-Time Satellite Telemetry...
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-[#A86B18] mx-auto" />
        <h2 className="text-xl font-bold text-[#18251D]">Trip Not Found</h2>
        <p className="text-xs text-[#66736A]">
          Unable to locate active GPS coordinates for booking reference #{id}.
        </p>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173F2D] text-white font-bold text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Bookings</span>
        </Link>
      </div>
    );
  }

  const badge = getStatusBadge(booking.status);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/bookings/${booking._id}`}
            className="p-2.5 rounded-xl border border-[#DDE6DF] bg-white text-[#66736A] hover:text-[#18251D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-0.5 rounded border border-[#DDE6DF] inline-block">
                Live Mission Control
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight mt-0.5">
              Live Trip Tracking • #{booking.bookingCode}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/bookings/${booking._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DDE6DF] bg-white text-xs font-semibold text-[#18251D] hover:bg-[#F7FAF7] transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#66736A]" />
            <span>Digital Pass Receipt</span>
          </Link>
        </div>
      </div>

      {/* Origin -> Destination Trip Route Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#DDE6DF] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736A] block">
              Origin (Pickup)
            </span>
            <p className="text-xs font-extrabold text-[#18251D] mt-0.5">
              {booking.pickupLocation}
            </p>
            <p className="text-[11px] text-[#66736A] mt-0.5">{formatDate(booking.startDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 text-[#B42318] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736A] block">
              Destination (Return)
            </span>
            <p className="text-xs font-extrabold text-[#18251D] mt-0.5">
              {booking.returnLocation}
            </p>
            <p className="text-[11px] text-[#66736A] mt-0.5">{formatDate(booking.endDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:border-l md:border-[#DDE6DF] md:pl-4">
          <div className="w-8 h-8 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center shrink-0 mt-0.5">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736A] block">
              Reserved Vehicle
            </span>
            <p className="text-xs font-extrabold text-[#18251D] mt-0.5">
              {booking.car?.title || "Rental Vehicle"}
            </p>
            <p className="text-[11px] text-[#173F2D] font-bold mt-0.5">
              {formatCurrency(booking.totalAmount)} Paid
            </p>
          </div>
        </div>
      </div>

      {/* REAL-TIME INTERACTIVE MAP & TELEMETRY TRACKER */}
      <LiveTripTracker
        bookingId={booking._id}
        bookingCode={booking.bookingCode}
        pickupLocation={booking.pickupLocation}
        returnLocation={booking.returnLocation}
        carTitle={booking.car?.title || "Rental Vehicle"}
        carImage={booking.car?.image}
        carCategory={booking.car?.category}
        status={booking.status}
      />

      {/* Emergency Assistance & Guidelines */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A86B18]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#A86B18] shrink-0" />
          <span>
            <strong className="text-[#18251D]">Prayagraj Highway Safety Patrol 24x7:</strong> In case of any breakdown on NH19
            or Purvanchal Expressway, press Emergency SOS or contact 112 / +91 98765 43210.
          </span>
        </div>
        <a
          href="tel:112"
          className="px-3 py-1.5 rounded-xl bg-[#A86B18] hover:bg-[#A86B18]/90 text-white font-extrabold text-xs shrink-0 text-center transition-colors shadow-xs"
        >
          Call 112 SOS
        </a>
      </div>
    </div>
  );
}
