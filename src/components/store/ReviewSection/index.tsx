"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

interface Props {
  productId: string;
  productName: string;
  avgRating: number | null;
  reviewCount: number;
}

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{ width: size, height: size }}
          className={s <= Math.round(rating) ? "text-[#E8A020] fill-[#E8A020]" : "text-[#DDD8D3] fill-[#DDD8D3]"}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              s <= (hovered || value) ? "text-[#E8A020] fill-[#E8A020]" : "text-[#DDD8D3] fill-[#DDD8D3]"
            }`}
            strokeWidth={0}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="text-[#6A5A5A] w-8 text-right">{label}</span>
      <div className="flex-1 h-1.5 bg-[#EADCDF] rounded-full overflow-hidden">
        <div className="h-full bg-[#E8A020] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[#9A9590] w-6 text-left">{count}</span>
    </div>
  );
}

const RATINGLABELS = ["5 ★", "4 ★", "3 ★", "2 ★", "1 ★"];

export default function ReviewSection({ productId, productName, avgRating: initialAvg, reviewCount: initialCount }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(initialAvg);
  const [reviewCount, setReviewCount] = useState(initialCount);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(data.reviews ?? []);
      if (data.reviews?.length) {
        const avg = data.reviews.reduce((s: number, r: Review) => s + r.rating, 0) / data.reviews.length;
        setAvgRating(avg);
        setReviewCount(data.reviews.length);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name.");
    if (!rating) return toast.error("Please select a star rating.");
    if (!body.trim() || body.trim().length < 10) return toast.error("Review must be at least 10 characters.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, reviewerName: name, rating, title, body }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setShowForm(false);
      toast.success("Review submitted! Thank you.");
      await loadReviews();
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = avgRating ?? 0;

  return (
    <div className="mt-20 border-t border-[#EADCDF] pt-14">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

          {/* Rating Summary */}
          <div>
            <h2 className="text-[10px] font-semibold tracking-[0.2em] text-[#880A25] mb-4">CUSTOMER REVIEWS</h2>

            {reviewCount > 0 ? (
              <>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-[#2F1820]">{displayRating.toFixed(1)}</span>
                  <span className="text-[#9A9590] text-sm">out of 5</span>
                </div>
                <StarDisplay rating={displayRating} size={18} />
                <p className="text-[#9A9590] text-xs mt-2 mb-5">Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
                <div className="space-y-2">
                  {ratingDist.map((d, i) => (
                    <RatingBar key={d.star} label={RATINGLABELS[i]} count={d.count} total={reviewCount} />
                  ))}
                </div>
              </>
            ) : (
              <div className="py-4">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 text-[#DDD8D3] fill-[#DDD8D3]" strokeWidth={0} />)}
                </div>
                <p className="text-sm text-[#9A9590]">No reviews yet.</p>
                <p className="text-xs text-[#B5B0AB] mt-1">Be the first to review {productName}!</p>
              </div>
            )}

            <button
              onClick={() => { setShowForm(true); setSubmitted(false); }}
              className="mt-6 w-full bg-[#880A25] hover:bg-[#6D0820] text-white py-3 text-[11px] font-semibold tracking-[0.15em] transition-colors"
            >
              WRITE A REVIEW
            </button>
          </div>

          {/* Review list + form */}
          <div>
            {/* Write a review form */}
            {showForm && (
              <div className="mb-8 bg-[#FFFDFA] border border-[#EADCDF] p-6">
                <h3 className="text-sm font-semibold text-[#2F1820] mb-4">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">YOUR RATING *</label>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">YOUR NAME *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mike T."
                      className="w-full bg-[#F8F7F5] border border-[#EADCDF] focus:border-[#880A25] text-[#2F1820] px-4 py-3 text-sm outline-none transition-colors"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">REVIEW TITLE</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Summarize your experience"
                      className="w-full bg-[#F8F7F5] border border-[#EADCDF] focus:border-[#880A25] text-[#2F1820] px-4 py-3 text-sm outline-none transition-colors"
                      maxLength={80}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">YOUR REVIEW *</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={4}
                      placeholder="What did you think of this product?"
                      className="w-full bg-[#F8F7F5] border border-[#EADCDF] focus:border-[#880A25] text-[#2F1820] px-4 py-3 text-sm outline-none transition-colors resize-none"
                      maxLength={500}
                    />
                    <p className="text-[10px] text-[#B5B0AB] mt-1">{body.length}/500</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-[#880A25] hover:bg-[#6D0820] disabled:opacity-60 text-white py-3 text-[11px] font-semibold tracking-[0.15em] transition-colors"
                    >
                      {submitting ? "Submitting..." : "SUBMIT REVIEW"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 border border-[#EADCDF] text-[#6A6560] hover:border-[#C8A0A8] text-[11px] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {submitted && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Your review has been submitted. Thank you!
              </div>
            )}

            {/* Reviews list */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse space-y-2 border-b border-[#EADCDF] pb-5">
                    <div className="h-3 bg-[#EADCDF] rounded w-24" />
                    <div className="h-4 bg-[#EADCDF] rounded w-48" />
                    <div className="h-3 bg-[#EADCDF] rounded w-full" />
                    <div className="h-3 bg-[#EADCDF] rounded w-4/5" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[#9A9590]">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-[#EADCDF]">
                {reviews.map((review) => (
                  <div key={review.id} className="py-6">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StarDisplay rating={review.rating} size={14} />
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[10px] text-[#52B788] font-medium">
                              <CheckCircle className="w-3 h-3" strokeWidth={2} />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        {review.title && (
                          <p className="text-[14px] font-semibold text-[#2F1820] mb-1">{review.title}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[12px] font-medium text-[#2F1820]">{review.reviewerName}</p>
                        <p className="text-[11px] text-[#9A9590]">
                          {new Date(review.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#6A5A5A] leading-relaxed">{review.body}</p>
                    {review.helpful > 0 && (
                      <div className="flex items-center gap-1.5 mt-3">
                        <ThumbsUp className="w-3 h-3 text-[#9A9590]" strokeWidth={1.5} />
                        <span className="text-[11px] text-[#9A9590]">{review.helpful} people found this helpful</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
