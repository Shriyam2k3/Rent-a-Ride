"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { IBooking, BookingStatus } from "@/types";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Loader2, Calendar, MapPin, Printer } from "lucide-react";

export default function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState("");

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking);
      }
    } catch (e) {
      console.error("Failed to load booking:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdateStatus = async (status: BookingStatus) => {
    setUpdating(true);
    setFeedback("");
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setFeedback(`Booking successfully updated to ${status}.`);
        await fetchBooking();
      }
    } catch (e) {
      alert("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs font-medium text-slate-500">Loading booking telemetry...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 max-w-md mx-auto">
        <p className="font-bold text-sm text-slate-800">Booking reference not found.</p>
        <Link href="/admin/bookings" className="text-emerald-600 hover:underline text-xs font-bold">
          Return to All Bookings
        </Link>
      </div>
    );
  }

  const badge = getStatusBadge(booking.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Manifest</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1">
            Dispatch Voucher #{booking.bookingCode}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Reservation Details
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Created on {formatDate(booking.createdAt)} • Prayagraj Operations
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
          {badge.label}
        </span>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Quick status update bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Quick Status Control:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleUpdateStatus("confirmed")}
              disabled={updating || booking.status === "confirmed"}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Set Confirmed
            </button>
            <button
              onClick={() => handleUpdateStatus("completed")}
              disabled={updating || booking.status === "completed"}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Set Completed
            </button>
            <button
              onClick={() => handleUpdateStatus("cancelled")}
              disabled={updating || booking.status === "cancelled"}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Set Cancelled
            </button>
          </div>
        </div>

        {/* Customer & Vehicle Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Customer Information
            </span>
            <p className="font-bold text-base text-[#172033]">{booking.user?.name || "Renter"}</p>
            <p className="text-slate-600">{booking.user?.email}</p>
            <p className="text-slate-500">{booking.user?.phone || "+91 98123 45678"}</p>
            <p className="text-slate-400 text-[11px] pt-1">
              User UID: <span className="font-mono">{booking.userId}</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="relative w-28 h-20 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
              <Image
                src={booking.car?.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80"}
                alt="Car"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Assigned Vehicle
              </span>
              <p className="font-bold text-sm text-[#172033]">{booking.car?.title || "Car"}</p>
              <p className="text-slate-500">
                {booking.car?.category} • {formatCurrency(booking.dailyRate)} / day
              </p>
              <Link
                href={`/cars/${booking.carId}`}
                target="_blank"
                className="text-emerald-600 hover:underline font-semibold block pt-1 text-[11px]"
              >
                Inspect Public Listing →
              </Link>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-y border-slate-100 py-6">
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Pickup Station & Date
            </span>
            <p className="font-bold text-sm text-[#172033]">{formatDate(booking.startDate)}</p>
            <p className="text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{booking.pickupLocation}</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Return Station & Date
            </span>
            <p className="font-bold text-sm text-[#172033]">{formatDate(booking.endDate)}</p>
            <p className="text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{booking.returnLocation}</span>
            </p>
          </div>
        </div>

        {/* Financial Reconciliation */}
        <div className="space-y-2 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-2">
            Payment Reconciliation (INR)
          </span>
          <div className="flex justify-between text-slate-600">
            <span>Rental Charge ({booking.totalDays} days × {formatCurrency(booking.dailyRate)})</span>
            <span className="font-semibold text-[#172033]">{formatCurrency(booking.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>GST & Standard Insurance (18%)</span>
            <span className="font-semibold text-[#172033]">{formatCurrency(booking.tax)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-base text-[#172033]">
            <span>Total Gross Revenue</span>
            <span className="text-emerald-600 font-black">{formatCurrency(booking.totalAmount)}</span>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <span className="font-bold text-slate-600 block mb-1">Renter Special Requests:</span>
            <p className="text-slate-700 italic">&ldquo;{booking.notes}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
