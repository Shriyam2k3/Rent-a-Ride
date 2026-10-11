"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ICar } from "@/types";
import { useAuth } from "@/lib/firebase/auth-context";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogIn,
  AlertTriangle,
} from "lucide-react";

interface BookingWidgetProps {
  car: ICar;
}

export default function BookingWidget({ car }: BookingWidgetProps) {
  const router = useRouter();
  const { user, mongoUser } = useAuth();

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const defaultReturn = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(defaultReturn);
  const [pickupLocation, setPickupLocation] = useState(car.location?.address || "Civil Lines Hub, Prayagraj");
  const [returnLocation, setReturnLocation] = useState(car.location?.address || "Civil Lines Hub, Prayagraj");
  const [notes, setNotes] = useState("");

  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{
    startDate?: string;
    endDate?: string;
    pickupLocation?: string;
    returnLocation?: string;
    user?: string;
  }>({});

  // Calculate rental duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(end.getTime() - start.getTime(), 86400000);
  const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const subtotal = car.dailyRate * days;
  const tax = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + tax;

  // Clear specific field error when input changes
  const clearFieldError = (fieldName: keyof typeof fieldErrors) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
    if (errorMessage) {
      setErrorMessage("");
      setMissingFields([]);
    }
  };

  // Check availability when dates change
  useEffect(() => {
    if (!startDate || !endDate) return;

    const check = async () => {
      setCheckingAvailability(true);
      setIsAvailable(null);

      try {
        const res = await fetch(`/api/bookings/check-availability?carId=${car._id}&startDate=${startDate}&endDate=${endDate}`);
        if (res.ok) {
          const data = await res.json();
          setIsAvailable(data.isAvailable);
        }
      } catch (e) {
        console.error("Availability check failed", e);
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timer = setTimeout(check, 400);
    return () => clearTimeout(timer);
  }, [car._id, startDate, endDate]);

  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    const missing: string[] = [];

    if (!user) {
      errors.user = "You must be signed in to reserve a vehicle.";
      missing.push("Customer Login");
    }

    if (!startDate) {
      errors.startDate = "Pickup date is required";
      missing.push("Pickup Date");
    }

    if (!endDate) {
      errors.endDate = "Return date is required";
      missing.push("Return Date");
    } else if (startDate && new Date(endDate) <= new Date(startDate)) {
      errors.endDate = "Return date must be after pickup date";
      missing.push("Valid Date Range");
    }

    if (!pickupLocation.trim()) {
      errors.pickupLocation = "Pickup location is required";
      missing.push("Pickup Location");
    }

    if (!returnLocation.trim()) {
      errors.returnLocation = "Return location is required";
      missing.push("Return Location");
    }

    setFieldErrors(errors);
    setMissingFields(missing);

    return Object.keys(errors).length === 0;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage("Please complete all required booking details highlighted below.");
      return;
    }

    if (!user) {
      router.push(`/login?redirect=/cars/${car._id}`);
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setMissingFields([]);

    const userId = user.uid || mongoUser?.firebaseUid || "uid_customer";
    const userName = user.displayName || mongoUser?.name || "Customer";
    const userEmail = user.email || "customer@rentaride.com";
    const userPhone = mongoUser?.phone || "+91 98123 45678";

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car._id,
          userId,
          user: {
            name: userName,
            email: userEmail,
            phone: userPhone,
          },
          startDate,
          endDate,
          pickupLocation: pickupLocation.trim(),
          returnLocation: returnLocation.trim(),
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.missingFields) {
          setMissingFields(data.missingFields);
        }
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
    <div className="bg-white rounded-2xl border border-[#DDE6DF] p-6 shadow-md sticky top-28 text-[#18251D]">
      {/* Header rate */}
      <div className="flex items-baseline justify-between pb-5 border-b border-[#DDE6DF]">
        <div>
          <span className="text-3xl font-black text-[#18251D]">
            {formatCurrency(car.dailyRate)}
          </span>
          <span className="text-xs font-semibold text-[#66736A]"> / day</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF]">
          Available Now
        </span>
      </div>

      <form onSubmit={handleBooking} className="mt-5 space-y-4">
        {/* Date Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className={`block text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${
                fieldErrors.startDate ? "text-[#B42318]" : "text-[#173F2D]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Pickup Date</span>
              <span className="text-[#B42318]">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setStartDate(e.target.value);
                clearFieldError("startDate");
              }}
              required
              className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-[#18251D] transition-all focus:outline-hidden ${
                fieldErrors.startDate
                  ? "border-[#B42318] ring-2 ring-[#B42318]/20 bg-red-50/30"
                  : "border-[#DDE6DF] bg-[#F7FAF7] focus:border-[#173F2D]"
              }`}
            />
            {fieldErrors.startDate && (
              <p className="text-[11px] text-[#B42318] font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.startDate}</span>
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${
                fieldErrors.endDate ? "text-[#B42318]" : "text-[#173F2D]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Return Date</span>
              <span className="text-[#B42318]">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                clearFieldError("endDate");
              }}
              required
              className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold text-[#18251D] transition-all focus:outline-hidden ${
                fieldErrors.endDate
                  ? "border-[#B42318] ring-2 ring-[#B42318]/20 bg-red-50/30"
                  : "border-[#DDE6DF] bg-[#F7FAF7] focus:border-[#173F2D]"
              }`}
            />
            {fieldErrors.endDate && (
              <p className="text-[11px] text-[#B42318] font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.endDate}</span>
              </p>
            )}
          </div>
        </div>

        {/* Location Inputs */}
        <div className="space-y-3">
          <div>
            <label
              className={`block text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${
                fieldErrors.pickupLocation ? "text-[#B42318]" : "text-[#66736A]"
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${fieldErrors.pickupLocation ? "text-[#B42318]" : "text-[#173F2D]"}`} />
              <span>Pickup Location</span>
              <span className="text-[#B42318]">*</span>
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => {
                setPickupLocation(e.target.value);
                clearFieldError("pickupLocation");
              }}
              placeholder="e.g. Civil Lines Hub, Prayagraj Junction, or Bamrauli Airport"
              className={`w-full px-3 py-2.5 rounded-xl border text-xs text-[#18251D] transition-all focus:outline-hidden ${
                fieldErrors.pickupLocation
                  ? "border-[#B42318] ring-2 ring-[#B42318]/20 bg-red-50/30"
                  : "border-[#DDE6DF] bg-[#F7FAF7] focus:border-[#173F2D]"
              }`}
            />
            {fieldErrors.pickupLocation && (
              <p className="text-[11px] text-[#B42318] font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.pickupLocation}</span>
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${
                fieldErrors.returnLocation ? "text-[#B42318]" : "text-[#66736A]"
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${fieldErrors.returnLocation ? "text-[#B42318]" : "text-[#173F2D]"}`} />
              <span>Return Location</span>
              <span className="text-[#B42318]">*</span>
            </label>
            <input
              type="text"
              value={returnLocation}
              onChange={(e) => {
                setReturnLocation(e.target.value);
                clearFieldError("returnLocation");
              }}
              placeholder="Same as pickup location"
              className={`w-full px-3 py-2.5 rounded-xl border text-xs text-[#18251D] transition-all focus:outline-hidden ${
                fieldErrors.returnLocation
                  ? "border-[#B42318] ring-2 ring-[#B42318]/20 bg-red-50/30"
                  : "border-[#DDE6DF] bg-[#F7FAF7] focus:border-[#173F2D]"
              }`}
            />
            {fieldErrors.returnLocation && (
              <p className="text-[11px] text-[#B42318] font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.returnLocation}</span>
              </p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#66736A] mb-1">
            Rental Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Flight number, child car seat, or specific arrival time..."
            className="w-full px-3 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D] resize-none"
          />
        </div>

        {/* Availability Status Badge */}
        <div className="py-1">
          {checkingAvailability ? (
            <div className="flex items-center gap-2 text-xs text-[#66736A]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#173F2D]" />
              <span>Checking calendar availability...</span>
            </div>
          ) : isAvailable === true ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#237447] bg-[#EEF5EF] px-3 py-2 rounded-xl border border-[#DDE6DF]">
              <CheckCircle2 className="w-4 h-4 text-[#237447] shrink-0" />
              <span>Available for these dates ({days} {days === 1 ? "day" : "days"})</span>
            </div>
          ) : isAvailable === false ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B42318] bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 text-[#B42318] shrink-0" />
              <span>Conflict: Vehicle unavailable for selected dates</span>
            </div>
          ) : null}
        </div>

        {/* Cost Breakdown */}
        <div className="bg-[#F7FAF7] rounded-xl p-4 space-y-2 border border-[#DDE6DF] text-xs">
          <div className="flex justify-between text-[#66736A]">
            <span>
              {formatCurrency(car.dailyRate)} × {days} {days === 1 ? "day" : "days"}
            </span>
            <span className="font-bold text-[#18251D]">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#66736A]">
            <span>GST &amp; Standard Insurance (18%)</span>
            <span className="font-bold text-[#18251D]">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-[#66736A]">
            <span>Cancellation Protection</span>
            <span className="text-[#237447] font-bold">Free (24h prior)</span>
          </div>
          <div className="pt-2 border-t border-[#DDE6DF] flex justify-between items-baseline text-sm font-bold text-[#18251D]">
            <span>Estimated Total</span>
            <span className="text-xl font-black text-[#173F2D]">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* Highlighting Box: Explicitly highlights what is missing */}
        {(errorMessage || missingFields.length > 0) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-2 text-[#B42318] font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage || "Missing required booking details"}</span>
            </div>

            {missingFields.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-[#66736A] block mb-1.5">
                  The following required items need your attention:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {missingFields.map((field) => (
                    <span
                      key={field}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-[#B42318] text-[11px] font-bold shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B42318]" />
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting || isAvailable === false}
          className="w-full py-3.5 px-4 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming Reservation...</span>
            </>
          ) : !user ? (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span>Sign In to Reserve Vehicle</span>
            </span>
          ) : (
            "Reserve Vehicle Now"
          )}
        </button>

        <p className="text-[10px] text-center text-[#66736A]">
          No charge until pickup. Free cancellation up to 24 hours before your trip.
        </p>
      </form>
    </div>
  );
}
