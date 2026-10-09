"use client";

import React, { useState, useEffect } from "react";
import { IReview } from "@/types";
import { formatDate } from "@/lib/utils";
import { Star, Trash2, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error("Failed to load reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this review from the public platform?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert("Failed to delete review");
      }
    } catch (e) {
      alert("Error deleting review");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1">
          Moderation & Feedback
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
          Customer Reviews & Ratings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor feedback submitted by drivers, inspect ratings, and moderate public feedback.
        </p>
      </div>

      {/* Review cards table / grid */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-xs font-medium text-slate-500">Loading verified customer reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No customer reviews logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Review Feedback</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-[#172033] flex items-center justify-center font-bold text-xs border border-slate-200">
                          {rev.userName?.charAt(0) || "U"}
                        </div>
                        <span className="font-bold text-[#172033]">{rev.userName}</span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="font-bold text-[11px] text-[#172033] ml-1">{rev.rating}.0</span>
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="px-6 py-4 text-slate-600 max-w-md leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {formatDate(rev.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Published
                      </span>
                    </td>

                    {/* Moderation */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(rev._id)}
                        disabled={deletingId === rev._id}
                        title="Delete review"
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        {deletingId === rev._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
