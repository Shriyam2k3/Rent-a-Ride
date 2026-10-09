"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { IBooking } from "@/types";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import ReviewModal from "@/components/review-modal";
import LiveTripTracker from "@/components/live-trip-tracker";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Printer,
  Loader2,
  Star,
  Navigation,
} from "lucide-react";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking);
      }
    } catch (e) {
      console.error("Failed to load booking details:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this reservation? Full refund will be issued according to our 24h cancellation policy.")) {
      return;
    }

    setCancelling(true);
    setActionMessage("");

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (res.ok) {
        setActionMessage("Reservation successfully cancelled. Refund has been initiated.");
        await fetchBooking();
      } else {
        alert("Failed to cancel reservation");
      }
    } catch (e) {
      alert("Error occurred while cancelling");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Booking Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested booking reference does not exist or has expired.
        </p>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Bookings
        </Link>
      </div>
    );
  }

  const badge = getStatusBadge(booking.status);
  const isCancellable = booking.status === "confirmed" || booking.status === "pending";

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/tracking/${booking._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Live GPS Tracker</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white bg-slate-50 shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass / Receipt</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Digital Pass Receipt Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        {/* Pass Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                Official Digital Rental Pass
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Reservation #{booking.bookingCode}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Booked on {formatDate(booking.createdAt)}
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <span className="text-xs text-slate-400 block">Total Rental Fee</span>
            <span className="text-2xl font-black text-white">
              {formatCurrency(booking.totalAmount)}
            </span>
            <span className="text-[11px] text-emerald-400 block font-semibold">Payment Verified</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Vehicle summary */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="relative w-full sm:w-48 h-32 rounded-xl bg-slate-200 overflow-hidden shrink-0">
              <Image
                src={booking.car?.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80"}
                alt={booking.car?.title || "Car"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                {booking.car?.category || "Vehicle"}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {booking.car?.title || "Rental Vehicle"}
              </h3>
              <p className="text-xs text-slate-500">
                Daily Rate: {formatCurrency(booking.dailyRate)} / day • {booking.totalDays} Total Days
              </p>
            </div>
          </div>

          {/* Itinerary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Pickup Schedule</span>
              </div>
              <p className="font-extrabold text-sm text-slate-900">
                {formatDate(booking.startDate)}
              </p>
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{booking.pickupLocation}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Return Schedule</span>
              </div>
              <p className="font-extrabold text-sm text-slate-900">
                {formatDate(booking.endDate)}
              </p>
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{booking.returnLocation}</span>
              </div>
            </div>
          </div>

          {/* Real-time Origin to Destination GPS Path & Vehicle Location Tracking */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  Real-Time Trip & Rider Location Tracking
                </h3>
              </div>
              <Link
                href={`/dashboard/tracking/${booking._id}`}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <span>Full-Screen Live View</span>
                <Navigation className="w-3 h-3" />
              </Link>
            </div>
            <LiveTripTracker
              bookingId={booking._id}
              bookingCode={booking.bookingCode}
              pickupLocation={booking.pickupLocation}
              returnLocation={booking.returnLocation}
              carTitle={booking.car?.title}
              carImage={booking.car?.image}
              carCategory={booking.car?.category}
              status={booking.status}
            />
          </div>

          {/* Renter Details & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-y border-slate-100 py-6">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Primary Driver
              </span>
              <p className="font-bold text-sm text-slate-900">{booking.user?.name || "Aarav Sharma"}</p>
              <p className="text-slate-500">{booking.user?.email || "driver@rentaride.com"}</p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Special Rental Notes
              </span>
              <p className="text-slate-600">
                {booking.notes || "No special requests submitted."}
              </p>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-3">
              Price Breakdown (INR)
            </h4>
            <div className="flex justify-between text-slate-600">
              <span>Rental Charge ({formatCurrency(booking.dailyRate)} × {booking.totalDays} days)</span>
              <span className="font-semibold text-slate-900">{formatCurrency(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST & Standard Fleet Insurance (18%)</span>
              <span className="font-semibold text-slate-900">{formatCurrency(booking.tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
              <span>Total Paid</span>
              <span className="text-emerald-600 font-extrabold">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            {isCancellable && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {cancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Cancel Reservation</span>
                  </>
                )}
              </button>
            )}

            {booking.status === "completed" && (
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>Rate & Review Vehicle</span>
              </button>
            )}

            <div className="text-[11px] text-slate-400 text-right w-full sm:w-auto">
              Present this confirmation pass or ID at the pickup counter.
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal if triggered */}
      {booking && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          carId={booking.carId}
          carTitle={booking.car?.title || "Car"}
          bookingId={booking._id}
          userName={booking.user?.name}
          onSuccess={fetchBooking}
        />
      )}
    </div>
  );
}
