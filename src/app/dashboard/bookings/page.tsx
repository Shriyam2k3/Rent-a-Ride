"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/firebase/auth-context";
import { IBooking } from "@/types";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import { Calendar, MapPin, ArrowRight, Loader2, Car, Navigation } from "lucide-react";

export default function BookingsHistoryPage() {
  const { user, mongoUser } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const uid = user?.uid || mongoUser?.firebaseUid || "uid_customer";
    try {
      const res = await fetch(`/api/bookings?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error("Failed to load bookings:", e);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, mongoUser?.firebaseUid]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return (b.status || "").toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Booking History
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-0.5">My Reservations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review past and upcoming vehicle reservations, receipts, and cancellation options.
          </p>
        </div>

        <Link
          href="/cars"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-500/20 transition-colors cursor-pointer"
        >
          <Car className="w-4 h-4" />
          <span>Rent Another Vehicle</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {["all", "confirmed", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
              filter === status
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {status} ({bookings.filter((b) => status === "all" || (b.status || "").toLowerCase() === status).length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-24 flex justify-center items-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto space-y-3">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-700">No {filter !== "all" ? filter : ""} bookings found</h3>
          <p className="text-xs text-slate-400">
            You don&apos;t have any reservations matching this filter.
          </p>
          <Link
            href="/cars"
            className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs mt-2 cursor-pointer"
          >
            Explore Fleet
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const badge = getStatusBadge(booking.status);
            return (
              <div
                key={booking._id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Vehicle Thumbnail & Title */}
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <Image
                      src={booking.car?.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80"}
                      alt={booking.car?.title || "Car"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{booking.bookingCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">
                      {booking.car?.title || "Rental Vehicle"}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.pickupLocation}</span>
                    </p>
                  </div>
                </div>

                {/* Rental Dates */}
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">
                    {formatDate(booking.startDate)} — {formatDate(booking.endDate)}
                  </p>
                  <p className="text-slate-400">
                    Duration: {booking.totalDays} {booking.totalDays === 1 ? "day" : "days"} ({formatCurrency(booking.dailyRate)}/day)
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Total Cost</span>
                    <span className="font-extrabold text-base text-slate-900">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(booking.status === "confirmed" || booking.status === "pending") && (
                      <Link
                        href={`/dashboard/tracking/${booking._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                        title="Track vehicle on live GPS map"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Track Live</span>
                      </Link>
                    )}

                    <Link
                      href={`/dashboard/bookings/${booking._id}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      <span>View Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
