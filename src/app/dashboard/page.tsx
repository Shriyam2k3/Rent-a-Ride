"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/firebase/auth-context";
import { IBooking } from "@/types";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import {
  Calendar,
  CreditCard,
  Car,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Navigation,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user, mongoUser } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBookings = useCallback(async () => {
    const uid = user?.uid || mongoUser?.firebaseUid || "uid_customer";
    try {
      const res = await fetch(`/api/bookings?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error("Failed to load user bookings:", e);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, mongoUser?.firebaseUid]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const totalSpent = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const upcomingBooking = activeBookings[0];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Customer Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-0.5">
            Welcome, {user?.displayName || mongoUser?.name || "Aarav Sharma"}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your active car rentals, travel itineraries, and verified driver profile.
          </p>
        </div>

        <Link
          href="/cars"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-500/20 transition-colors"
        >
          <Car className="w-4 h-4" />
          <span>Book a New Car</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Bookings</p>
            <p className="text-2xl font-extrabold text-slate-900">{activeBookings.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Completed Trips</p>
            <p className="text-2xl font-extrabold text-slate-900">{completedBookings.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Reservations</p>
            <p className="text-2xl font-extrabold text-slate-900">{bookings.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Spent</p>
            <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Featured Next Trip Card if active */}
      {upcomingBooking && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Calendar className="w-3.5 h-3.5" />
                <span>Upcoming Reservation • Ref #{upcomingBooking.bookingCode}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {upcomingBooking.car?.title || "Reserved Vehicle"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300 pt-2">
                <div>
                  <span className="block text-slate-400 font-semibold text-[11px] uppercase">Pickup Date</span>
                  <span className="font-bold text-white text-sm">{formatDate(upcomingBooking.startDate)}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold text-[11px] uppercase">Return Date</span>
                  <span className="font-bold text-white text-sm">{formatDate(upcomingBooking.endDate)}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold text-[11px] uppercase">Location</span>
                  <span className="font-bold text-white text-sm truncate">{upcomingBooking.pickupLocation}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/dashboard/tracking/${upcomingBooking._id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Track Vehicle Live</span>
                </Link>

                <Link
                  href={`/dashboard/bookings/${upcomingBooking._id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Pass & Receipt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Car Image Preview */}
            <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
              <Image
                src={upcomingBooking.car?.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"}
                alt={upcomingBooking.car?.title || "Car"}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Bookings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Overview of your recent vehicle rentals</p>
          </div>
          <Link
            href="/dashboard/bookings"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-3">
            <p>You haven&apos;t made any reservations yet.</p>
            <Link
              href="/cars"
              className="inline-block px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Explore Cars
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Booking Ref</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Dates</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.slice(0, 5).map((booking) => {
                  const badge = getStatusBadge(booking.status);
                  return (
                    <tr key={booking._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {booking.bookingCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-7 rounded bg-slate-100 overflow-hidden shrink-0">
                            <Image
                              src={booking.car?.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80"}
                              alt="car"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-slate-800">
                            {booking.car?.title || "Vehicle"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(booking.startDate)} — {formatDate(booking.endDate)} ({booking.totalDays}d)
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/bookings/${booking._id}`}
                          className="font-bold text-emerald-600 hover:underline cursor-pointer"
                        >
                          View Receipt
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
