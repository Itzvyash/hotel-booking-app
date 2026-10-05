import React from 'react';
import { X, Check, Star, ShieldCheck, ArrowRight, Sparkles, MapPin, Maximize2 } from 'lucide-react';
import { Room } from '../types/hotel';
import { formatPrice } from '../utils/bookingUtils';

interface RoomDetailModalProps {
  room: Room | null;
  nights: number;
  currency: 'USD' | 'EUR' | 'GBP';
  onClose: () => void;
  onSelectRoom: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  nights,
  currency,
  onClose,
  onSelectRoom,
}) => {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  if (!room) return null;

  const galleryImages = [room.image, ...(room.additionalImages || [])];
  const stayTotal = room.pricePerNight * nights;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF9F5] text-[#1E1E24] max-w-4xl w-full border border-[#E7E4DC] shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-white text-[#1E1E24] flex items-center justify-center rounded-full shadow-md transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Gallery Header */}
        <div className="relative aspect-16/9 sm:aspect-21/9 overflow-hidden bg-[#E2DED5]">
          <img
            src={galleryImages[activeImageIndex] || room.image}
            alt={room.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Overlay Room Title */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="text-xs uppercase tracking-[0.2em] text-[#E0CEB5] font-medium mb-1">
              {room.view} · Floor {room.floorLevel}
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-normal leading-tight">
              {room.name}
            </h2>
          </div>

          {/* Gallery Thumbnail Selector */}
          {galleryImages.length > 1 && (
            <div className="absolute top-4 left-6 flex items-center gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-8 border-2 overflow-hidden cursor-pointer transition-all ${
                    activeImageIndex === idx ? 'border-[#C5A880] scale-105' : 'border-white/60 opacity-80'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          {/* Key Specs Bar (Zero-Pill: Clean unboxed metadata) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#E8E5DD] mb-6 text-xs">
            <div>
              <span className="block text-[#82828C] uppercase tracking-wider text-[10px]">Accommodates</span>
              <span className="font-medium text-[#1E1E24] text-sm">Up to {room.capacity.maxGuests} Guests</span>
            </div>
            <div>
              <span className="block text-[#82828C] uppercase tracking-wider text-[10px]">Bedding</span>
              <span className="font-medium text-[#1E1E24] text-sm">{room.bedType}</span>
            </div>
            <div>
              <span className="block text-[#82828C] uppercase tracking-wider text-[10px]">Suite Space</span>
              <span className="font-medium text-[#1E1E24] text-sm">{room.sizeSqm} m² / {room.sizeSqft} sq ft</span>
            </div>
            <div>
              <span className="block text-[#82828C] uppercase tracking-wider text-[10px]">Guest Rating</span>
              <span className="font-medium text-[#1E1E24] text-sm">★ {room.rating} ({room.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-display text-xl font-normal text-[#1E1E24] mb-2">The Residence Experience</h3>
            <p className="text-xs sm:text-sm text-[#50505A] leading-relaxed font-light">
              {room.description}
            </p>
          </div>

          {/* Room Highlights */}
          <div className="mb-6 bg-[#F4F1EA] p-4 sm:p-5 border border-[#EBE7DF]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E1E24] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <span>Complimentary Reserve Privileges</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#3E3E46]">
                  <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Suite Amenities */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E1E24] mb-3">
              Room Appointments & Technology
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-[#55555F]">
              {room.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies & Reassurances */}
          <div className="pt-4 border-t border-[#E8E5DD] text-xs text-[#7A7A84] space-y-1 font-light">
            <p>· Check-in begins at 3:00 PM; Check-out is 12:00 PM (Late check-out subject to availability).</p>
            <p>· Flexible cancellation: Full refund up to 48 hours prior to local arrival time.</p>
            <p>· 100% non-smoking suite. Private in-suite dining available 24 hours.</p>
          </div>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="bg-[#FAF9F5] border-t border-[#E8E5DD] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#82828C]">Total Stay Price</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-normal text-[#1E1E24] tabular-nums">
                {formatPrice(stayTotal, currency)}
              </span>
              <span className="text-xs text-[#7A7A84]">
                ({formatPrice(room.pricePerNight, currency)} / night · {nights} {nights === 1 ? 'night' : 'nights'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 border border-[#D9D6CE] text-xs font-semibold uppercase tracking-wider text-[#4A4A52] hover:bg-[#EFECE5] transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectRoom(room);
              }}
              className="w-1/2 sm:w-auto bg-[#1E1E24] hover:bg-[#C5A880] text-white px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Reserve Suite</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
