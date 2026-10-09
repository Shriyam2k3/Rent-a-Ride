"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { IUser, IBooking } from "@/types";
import { formatDate, formatCurrency, getStatusBadge } from "@/lib/utils";
import { ArrowLeft, User, ShieldCheck, Calendar, Loader2 } from "lucide-react";

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [targetUser, setTargetUser] = useState<IUser | null>(null);
  const [userBookings, setUserBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      setLoading(true);
      try {
        const [usersRes, bookingsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch(`/api/bookings?userId=${id}`),
        ]);

        if (usersRes.ok) {
          const uJson = await usersRes.json();
          const found = (uJson.users as IUser[]).find((u) => u._id === id || u.firebaseUid === id);
          if (found) setTargetUser(found);
        }

        if (bookingsRes.ok) {
          const bJson = await bookingsRes.json();
          setUserBookings(bJson.bookings || []);
        }
      } catch (e) {
        console.error("Failed to load user:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs font-medium text-slate-500">Loading customer profile...</p>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 max-w-md mx-auto">
        <p className="font-bold text-sm text-slate-800">User profile not found.</p>
        <Link href="/admin/users" className="text-emerald-600 hover:underline text-xs font-bold">
          Return to user directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Customer Directory</span>
      </Link>

      {/* User Overview Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-[#172033] border border-slate-200 flex items-center justify-center font-bold text-2xl shadow-2xs">
            {targetUser.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#172033]">{targetUser.name}</h1>
              {targetUser.role === "admin" && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{targetUser.email}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Account registered on {formatDate(targetUser.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Booking History for this User */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#172033]">Rental History</h3>
          <p className="text-xs text-slate-500">All reservations placed by this customer</p>
        </div>

        {userBookings.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No booking records found for this account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3.5">Ref ID</th>
                  <th className="px-6 py-3.5">Vehicle</th>
                  <th className="px-6 py-3.5">Dates</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {userBookings.map((b) => {
                  const badge = getStatusBadge(b.status);
                  return (
                    <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#172033]">
                        {b.bookingCode}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {b.car?.title || "Car"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(b.startDate)} → {formatDate(b.endDate)}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-[#172033]">
                        {formatCurrency(b.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/bookings/${b._id}`}
                          className="font-bold text-emerald-600 hover:underline"
                        >
                          View Pass
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
