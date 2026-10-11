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
      <div className="py-24 flex justify-center items-center text-[#66736A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#18251D]">Booking Not Found</h2>
        <p className="text-xs text-[#66736A]">
          The requested booking reference does not exist or has expired.
        </p>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173F2D] text-white text-xs font-semibold hover:bg-[#2F7650] cursor-pointer"
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66736A] hover:text-[#18251D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/tracking/${booking._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white shadow-sm cursor-pointer transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Live GPS Tracker</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-[#DDE6DF] text-[#18251D] hover:bg-[#F7FAF7] bg-white cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass / Receipt</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#173F2D] shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Digital Pass Receipt Container */}
      <div className="bg-white rounded-3xl border border-[#DDE6DF] shadow-sm overflow-hidden">
        {/* Pass Header Banner */}
        <div className="bg-[#F7FAF7] text-[#18251D] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE6DF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#173F2D]">
                Official Digital Rental Pass
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-[#18251D] tracking-tight">
              Reservation #{booking.bookingCode}
            </h1>
            <p className="text-xs text-[#66736A] mt-1">
              Booked on {formatDate(booking.createdAt)}
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-[#DDE6DF] sm:pl-6">
            <span className="text-xs text-[#66736A] block">Total Rental Fee</span>
            <span className="text-2xl font-black text-[#173F2D]">
              {formatCurrency(booking.totalAmount)}
            </span>
            <span className="text-[11px] text-[#237447] block font-semibold">Payment Verified</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Vehicle summary */}
          <div className="flex flex-col sm:row items-center gap-6 p-4 rounded-2xl bg-[#F7FAF7] border border-[#DDE6DF]">
            <div className="relative w-full sm:w-48 h-32 rounded-xl bg-white overflow-hidden shrink-0 border border-[#DDE6DF]">
              <Image
                src={booking.car?.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80"}
                alt={booking.car?.title || "Car"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2 py-0.5 rounded border border-[#DDE6DF] inline-block">
                {booking.car?.category || "Vehicle"}
              </span>
              <h3 className="text-xl font-bold text-[#18251D]">
                {booking.car?.title || "Rental Vehicle"}
              </h3>
              <p className="text-xs text-[#66736A]">
                Daily Rate: {formatCurrency(booking.dailyRate)} / day • {booking.totalDays} Total Days
              </p>
            </div>
          </div>

          {/* Itinerary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] space-y-3">
              <div className="flex items-center gap-2 text-[#66736A] font-semibold uppercase tracking-wider text-[11px]">
                <Calendar className="w-4 h-4 text-[#173F2D]" />
                <span>Pickup Schedule</span>
              </div>
              <p className="font-extrabold text-sm text-[#18251D]">
                {formatDate(booking.startDate)}
              </p>
              <div className="flex items-center gap-1.5 text-[#66736A]">
                <MapPin className="w-3.5 h-3.5 text-[#173F2D] shrink-0" />
                <span>{booking.pickupLocation}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] space-y-3">
              <div className="flex items-center gap-2 text-[#66736A] font-semibold uppercase tracking-wider text-[11px]">
                <Calendar className="w-4 h-4 text-[#173F2D]" />
                <span>Return Schedule</span>
              </div>
              <p className="font-extrabold text-sm text-[#18251D]">
                {formatDate(booking.endDate)}
              </p>
              <div className="flex items-center gap-1.5 text-[#66736A]">
                <MapPin className="w-3.5 h-3.5 text-[#173F2D] shrink-0" />
                <span>{booking.returnLocation}</span>
              </div>
            </div>
          </div>

          {/* Real-time Origin to Destination GPS Path & Vehicle Location Tracking */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#237447] animate-pulse" />
                <h3 className="font-extrabold text-sm text-[#18251D] tracking-tight">
                  Real-Time Trip & Rider Location Tracking
                </h3>
              </div>
              <Link
                href={`/dashboard/tracking/${booking._id}`}
                className="text-xs font-bold text-[#173F2D] hover:text-[#2F7650] hover:underline flex items-center gap-1"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-y border-[#DDE6DF] py-6">
            <div>
              <span className="font-bold text-[#66736A] uppercase tracking-wider text-[10px] block mb-1">
                Primary Driver
              </span>
              <p className="font-bold text-sm text-[#18251D]">{booking.user?.name || "Customer"}</p>
              <p className="text-[#66736A]">{booking.user?.email || "customer@rentaride.com"}</p>
            </div>

            <div>
              <span className="font-bold text-[#66736A] uppercase tracking-wider text-[10px] block mb-1">
                Special Rental Notes
              </span>
              <p className="text-[#66736A]">
                {booking.notes || "No special requests submitted."}
              </p>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[#66736A] text-[10px] mb-3">
              Price Breakdown (INR)
            </h4>
            <div className="flex justify-between text-[#66736A]">
              <span>Rental Charge ({formatCurrency(booking.dailyRate)} × {booking.totalDays} days)</span>
              <span className="font-semibold text-[#18251D]">{formatCurrency(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#66736A]">
              <span>GST & Standard Fleet Insurance (18%)</span>
              <span className="font-semibold text-[#18251D]">{formatCurrency(booking.tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#DDE6DF] font-bold text-sm text-[#18251D]">
              <span>Total Paid</span>
              <span className="text-[#173F2D] font-extrabold">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DDE6DF]">
            {isCancellable && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-[#B42318] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>Rate & Review Vehicle</span>
              </button>
            )}

            <div className="text-[11px] text-[#66736A] text-right w-full sm:w-auto">
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
