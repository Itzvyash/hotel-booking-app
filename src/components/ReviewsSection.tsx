import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { VERIFIED_REVIEWS } from '../data/hotelData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-[#E8E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-2">
              Guest Chronicles
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#1E1E24]">
              Stories of Transcendent Stays
            </h2>
          </div>

          <div className="text-left md:text-right">
            <div className="flex items-center gap-1 md:justify-end text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-xs text-[#7A7A84]">
              <span className="font-semibold text-[#1E1E24] text-sm tabular-nums">4.97 / 5.0</span> Overall Guest Satisfaction
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>420+ Verified Bookings</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VERIFIED_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF9F5] border border-[#E7E4DC] p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Clean unboxed metadata per zero-pill rules */}
                <div className="flex items-center justify-between text-xs text-[#8A8A92] mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-emerald-800 font-medium">Verified Direct Booking</span>
                </div>

                <blockquote className="text-xs sm:text-sm text-[#44444D] leading-relaxed font-light mb-6 italic">
                  "{rev.comment}"
                </blockquote>
              </div>

              <div className="border-t border-[#EAE6DE] pt-4">
                <div className="font-medium text-xs sm:text-sm text-[#1E1E24]">
                  {rev.author}
                </div>
                <div className="text-[11px] text-[#7A7A84] mt-0.5">
                  {rev.location}
                  <span className="mx-1" aria-hidden="true">·</span>
                  <span>{rev.stayDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
