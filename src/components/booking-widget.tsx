"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ICar } from "@/types";
import { useAuth } from "@/lib/firebase/auth-context";
import { formatCurrency, calculateRentalDays } from "@/lib/utils";
import { Calendar, CheckCircle2, AlertCircle, Loader2, MapPin } from "lucide-react";

interface BookingWidgetProps {
  car: ICar;
}

export default function BookingWidget({ car }: BookingWidgetProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Initial dates: tomorrow to 4 days from now
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const defaultReturn = new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(defaultReturn);
  const [pickupLocation, setPickupLocation] = useState(car.location.address || `${car.location.city} Hub`);
  const [returnLocation, setReturnLocation] = useState(car.location.address || `${car.location.city} Hub`);
  const [notes, setNotes] = useState("");

  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const days = calculateRentalDays(startDate, endDate);
  const subtotal = car.dailyRate * days;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const totalAmount = Math.round((subtotal + tax) * 100) / 100;

  // Auto-check availability when dates change
  useEffect(() => {
    let isCancelled = false;

    const check = async () => {
      if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
        setIsAvailable(null);
        return;
      }

      setCheckingAvailability(true);
      setErrorMessage("");

      try {
        const res = await fetch(
          `/api/cars/${car._id}/availability?startDate=${startDate}&endDate=${endDate}`
        );
        const data = await res.json();
        if (!isCancelled) {
          if (res.ok) {
            setIsAvailable(data.available);
          } else {
            setIsAvailable(false);
            setErrorMessage(data.error || "Selected dates unavailable");
          }
        }
      } catch (e) {
        if (!isCancelled) setIsAvailable(true);
      } finally {
        if (!isCancelled) setCheckingAvailability(false);
      }
    };

    check();

    return () => {
      isCancelled = true;
    };
  }, [startDate, endDate, car._id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user) {
      // Store pending booking details in sessionStorage and redirect to login
      sessionStorage.setItem(
        "rar_pending_booking",
        JSON.stringify({
          carId: car._id,
          startDate,
          endDate,
          pickupLocation,
          returnLocation,
          notes,
        })
      );
      router.push(`/login?redirect=/cars/${car._id}`);
      return;
    }

    if (isAvailable === false) {
      setErrorMessage("This vehicle is already reserved for the selected dates. Please adjust your dates.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car._id,
          userId: user.uid,
          user: {
            name: user.displayName || user.email?.split("@")[0] || "Valued Customer",
            email: user.email,
          },
          startDate,
          endDate,
          pickupLocation,
          returnLocation,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete reservation");
      }

      // Route directly to booking confirmation/receipt
      router.push(`/dashboard/bookings/${data.booking._id}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Booking submission failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md sticky top-24">
      {/* Header rate */}
      <div className="flex items-baseline justify-between pb-5 border-b border-slate-100">
        <div>
          <span className="text-3xl font-extrabold text-slate-900">
            {formatCurrency(car.dailyRate)}
          </span>
          <span className="text-sm font-semibold text-slate-500"> / day</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Available Now
        </span>
      </div>

      <form onSubmit={handleBooking} className="mt-5 space-y-4">
        {/* Date Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Pickup Date
            </label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Return Date
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Location Inputs */}
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Pickup Location
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g. Civil Lines Hub, Prayagraj Junction, or Bamrauli Airport"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Return Location
            </label>
            <input
              type="text"
              value={returnLocation}
              onChange={(e) => setReturnLocation(e.target.value)}
              placeholder="Same as pickup location"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Rental Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Flight number, child car seat, or specific arrival time..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600 resize-none"
          />
        </div>

        {/* Availability Status Badge */}
        <div className="py-1">
          {checkingAvailability ? (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Checking calendar availability...</span>
            </div>
          ) : isAvailable === true ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Available for these dates ({days} {days === 1 ? "day" : "days"})</span>
            </div>
          ) : isAvailable === false ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Conflict: Vehicle unavailable for selected dates</span>
            </div>
          ) : null}
        </div>

        {/* Cost Breakdown */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>
              {formatCurrency(car.dailyRate)} × {days} {days === 1 ? "day" : "days"}
            </span>
            <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>GST & Standard Insurance (18%)</span>
            <span className="font-semibold text-slate-900">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Cancellation Protection</span>
            <span className="text-emerald-700 font-semibold">Free (24h prior)</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-slate-900">
            <span>Estimated Total</span>
            <span className="text-lg font-extrabold text-emerald-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting || isAvailable === false}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming Reservation...</span>
            </>
          ) : !user ? (
            "Sign In to Reserve Vehicle"
          ) : (
            "Reserve Vehicle Now"
          )}
        </button>

        <p className="text-[11px] text-center text-slate-600">
          No charge until pickup. Free cancellation up to 24 hours before your trip.
        </p>
      </form>
    </div>
  );
}
