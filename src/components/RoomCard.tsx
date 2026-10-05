import React from 'react';
import { Eye, ArrowRight, Star, Check } from 'lucide-react';
import { Room } from '../types/hotel';
import { formatPrice } from '../utils/bookingUtils';

interface RoomCardProps {
  room: Room;
  nights: number;
  currency: 'USD' | 'EUR' | 'GBP';
  onViewDetails: (room: Room) => void;
  onSelectRoom: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  nights,
  currency,
  onViewDetails,
  onSelectRoom,
}) => {
  const stayTotal = room.pricePerNight * nights;

  return (
    <article className="group bg-white border border-[#E7E4DC] flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div>
        {/* Room Photography Slot */}
        <div className="relative aspect-4/3 overflow-hidden bg-[#ECE8DF]">
          <img
            src={room.image}
            alt={room.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Quick Preview Overlay Button */}
          <button
            type="button"
            onClick={() => onViewDetails(room)}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            aria-label={`View details of ${room.name}`}
          >
            <span className="bg-white/95 text-[#1E1E24] text-xs font-semibold uppercase tracking-wider py-2 px-4 shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Explore Suite</span>
            </span>
          </button>

          {/* Subtle Corner Text Tag (No pill, clean editorial tag) */}
          {room.isPopular && (
            <div className="absolute top-3 left-3 bg-[#1E1E24]/90 backdrop-blur-xs text-white text-[10px] uppercase tracking-[0.16em] font-medium py-1 px-2.5">
              Guest Favorite
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5 sm:p-6">
          {/* Metadata Bar (Zero-Pill: Unboxed clean text with typographic bullet separators) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#7A7A84] mb-2 font-normal">
            <span>{room.bedType}</span>
            <span aria-hidden="true">·</span>
            <span>{room.sizeSqm} m² ({room.sizeSqft} sq ft)</span>
            <span aria-hidden="true">·</span>
            <span>{room.view}</span>
          </div>

          {/* Room Title */}
          <h3 className="font-display text-xl sm:text-2xl font-normal text-[#1E1E24] tracking-tight leading-snug mb-1.5">
            {room.name}
          </h3>

          <p className="text-xs text-[#63636C] font-light leading-relaxed mb-4 line-clamp-2">
            {room.subtitle}
          </p>

          {/* Key Feature Highlights */}
          <ul className="space-y-1.5 mb-5 border-t border-[#F0ECE4] pt-4">
            {room.highlights.slice(0, 3).map((item, i) => (
              <li key={i} className="text-xs text-[#44444C] flex items-start gap-2">
                <span className="text-[#C5A880] mt-0.5" aria-hidden="true">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing & Booking Footer */}
      <div className="p-5 sm:p-6 pt-0 border-t border-[#F0ECE4]">
        <div className="flex items-end justify-between pt-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#8A8A92] font-medium">
              Rate per night
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-normal text-[#1E1E24] tabular-nums">
                {formatPrice(room.pricePerNight, currency)}
              </span>
              {room.originalPricePerNight && (
                <span className="text-xs text-[#9E9EA6] line-through tabular-nums">
                  {formatPrice(room.originalPricePerNight, currency)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#7A7A84] tabular-nums mt-0.5">
              {formatPrice(stayTotal, currency)} total for {nights} {nights === 1 ? 'night' : 'nights'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectRoom(room)}
            className="bg-[#1E1E24] hover:bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-[0.14em] py-2.5 px-4 transition-colors flex items-center gap-1.5 group cursor-pointer shadow-xs"
          >
            <span>Reserve</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
