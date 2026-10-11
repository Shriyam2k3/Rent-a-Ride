"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IBooking, BookingStatus } from "@/types";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import { Search, Loader2, ArrowRight, Calendar, User, Car } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error("Failed to load bookings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id || b.bookingCode === id ? { ...b, status: newStatus } : b))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      alert("Error updating booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = (search || "").toLowerCase();
    const matchesSearch =
      (b.bookingCode || "").toLowerCase().includes(q) ||
      (b.user?.name || "").toLowerCase().includes(q) ||
      (b.user?.email || "").toLowerCase().includes(q) ||
      (b.car?.title || "").toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || (b.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#DDE6DF] inline-block mb-1">
          Reservations Telemetry
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
          Platform Bookings Management
        </h1>
        <p className="text-xs text-[#66736A] mt-1">
          Review, approve, fulfill, or cancel customer vehicle reservations across all UP stations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#DDE6DF] p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#66736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code, customer name, vehicle..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] text-xs text-[#18251D] placeholder:text-[#66736A] focus:outline-hidden focus:border-[#173F2D] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["all", "confirmed", "pending", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#173F2D] text-white font-extrabold shadow-sm"
                  : "bg-white border border-[#DDE6DF] text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7]"
              }`}
            >
              {st} ({bookings.filter((b) => st === "all" || (b.status || "").toLowerCase() === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-[#DDE6DF] rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#66736A]">
            <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
            <p className="text-xs font-medium text-[#66736A]">Loading booking telemetry...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#66736A] space-y-3">
            <Calendar className="w-8 h-8 text-[#66736A] mx-auto" />
            <p className="font-semibold text-[#18251D]">No bookings match the selected status or query.</p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="text-xs font-bold text-[#173F2D] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#18251D]">
              <thead className="bg-[#F7FAF7] text-[11px] uppercase tracking-wider text-[#66736A] font-semibold border-b border-[#DDE6DF]">
                <tr>
                  <th className="px-6 py-3.5">Booking Ref</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Vehicle</th>
                  <th className="px-6 py-3.5">Rental Schedule</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE6DF] font-medium">
                {filteredBookings.map((b) => {
                  const badge = getStatusBadge(b.status);
                  return (
                    <tr key={b._id} className="hover:bg-[#F7FAF7] transition-colors">
                      {/* Booking Code */}
                      <td className="px-6 py-4 font-mono font-bold text-[#18251D]">
                        <Link
                          href={`/admin/bookings/${b._id}`}
                          className="hover:text-[#173F2D] transition-colors"
                        >
                          {b.bookingCode}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center font-bold text-[11px] shrink-0">
                            {b.user?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-[#18251D]">{b.user?.name || "Renter"}</p>
                            <p className="text-[11px] text-[#66736A]">{b.user?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-7 rounded bg-[#F7FAF7] overflow-hidden shrink-0 border border-[#DDE6DF]">
                            <Image
                              src={b.car?.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80"}
                              alt="car"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-[#18251D] line-clamp-1">{b.car?.title || "Vehicle"}</span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4 text-[#66736A] whitespace-nowrap">
                        <p className="font-semibold text-[#18251D]">
                          {formatDate(b.startDate)} → {formatDate(b.endDate)}
                        </p>
                        <p className="text-[11px] text-[#66736A]">
                          {b.totalDays} {b.totalDays === 1 ? "day" : "days"} • {b.pickupLocation}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-extrabold text-[#18251D]">
                        {formatCurrency(b.totalAmount)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4">
                        {updatingId === b._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#173F2D]" />
                        ) : (
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleStatusChange(b._id, e.target.value as BookingStatus)
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border bg-white text-[#18251D] cursor-pointer focus:outline-hidden ${badge.bg}`}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/bookings/${b._id}`}
                          className="inline-flex items-center gap-1 font-bold text-[#173F2D] hover:text-[#2F7650]"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
