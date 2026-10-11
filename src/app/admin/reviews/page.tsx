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
        <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#DDE6DF] inline-block mb-1">
          Moderation &amp; Feedback
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
          Customer Reviews &amp; Ratings
        </h1>
        <p className="text-xs text-[#66736A] mt-1">
          Monitor feedback submitted by drivers, inspect ratings, and moderate public feedback.
        </p>
      </div>

      {/* Review cards table / grid */}
      <div className="bg-white border border-[#DDE6DF] rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#66736A]">
            <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
            <p className="text-xs font-medium text-[#66736A]">Loading verified customer reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#66736A] space-y-2">
            <MessageSquare className="w-8 h-8 text-[#66736A] mx-auto" />
            <p className="font-semibold text-[#18251D]">No customer reviews logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#18251D]">
              <thead className="bg-[#F7FAF7] text-[11px] uppercase tracking-wider text-[#66736A] font-semibold border-b border-[#DDE6DF]">
                <tr>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Review Feedback</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE6DF] font-medium">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-[#F7FAF7] transition-colors">
                    {/* Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center font-bold text-xs">
                          {rev.userName?.charAt(0) || "U"}
                        </div>
                        <span className="font-bold text-[#18251D]">{rev.userName}</span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-[#A86B18] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 w-fit">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? "fill-[#A86B18] text-[#A86B18]" : "text-slate-300"
                            }`}
                          />
                        ))}
                        <span className="font-bold text-[11px] text-[#A86B18] ml-1">{rev.rating}.0</span>
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="px-6 py-4 text-[#66736A] max-w-md leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-[#66736A] whitespace-nowrap">
                      {formatDate(rev.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#237447] bg-[#EEF5EF] px-2.5 py-0.5 rounded-full border border-[#DDE6DF]">
                        <CheckCircle2 className="w-3 h-3 text-[#237447]" />
                        Published
                      </span>
                    </td>

                    {/* Moderation */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(rev._id)}
                        disabled={deletingId === rev._id}
                        title="Remove review"
                        className="p-1.5 rounded-lg border border-[#DDE6DF] text-[#66736A] hover:text-[#B42318] hover:bg-red-50 transition-colors cursor-pointer"
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
