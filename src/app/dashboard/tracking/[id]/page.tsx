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
  HelpCircle,
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs font-semibold text-slate-500">
          Connecting to Real-Time Satellite Telemetry...
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trip Not Found</h2>
        <p className="text-xs text-slate-500">
          Unable to locate active GPS coordinates for booking reference #{id}.
        </p>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
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
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Live Mission Control
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Live Trip Tracking • #{booking.bookingCode}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/bookings/${booking._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Digital Pass Receipt</span>
          </Link>
        </div>
      </div>

      {/* Origin -> Destination Trip Route Card */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Origin (Pickup)
            </span>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
              {booking.pickupLocation}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(booking.startDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Destination (Return)
            </span>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
              {booking.returnLocation}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(booking.endDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Reserved Vehicle
            </span>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
              {booking.car?.title || "Rental Vehicle"}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
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
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Prayagraj Highway Safety Patrol 24x7:</strong> In case of any breakdown on NH19
            or Purvanchal Expressway, press Emergency SOS or contact 112 / +91 98765 43210.
          </span>
        </div>
        <a
          href="tel:112"
          className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs shrink-0 text-center hover:bg-amber-700 transition-colors shadow-xs"
        >
          Call 112 SOS
        </a>
      </div>
    </div>
  );
}
