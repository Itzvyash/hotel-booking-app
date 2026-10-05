import React from 'react';
import { Calendar, Users, ChevronDown, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { BookingSearchCriteria, RoomCategory } from '../types/hotel';
import { calculateNights } from '../utils/bookingUtils';
import { IMAGES } from '../data/hotelData';

interface HeroSectionProps {
  searchCriteria: BookingSearchCriteria;
  onSearchChange: (newCriteria: Partial<BookingSearchCriteria>) => void;
  onCheckAvailability: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchCriteria,
  onSearchChange,
  onCheckAvailability,
}) => {
  const [guestPickerOpen, setGuestPickerOpen] = React.useState(false);
  const nights = calculateNights(searchCriteria.checkIn, searchCriteria.checkOut);

  // Close guest popover on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#guest-picker-container')) {
        setGuestPickerOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Hero Image with Measured Gradient Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={IMAGES.hero}
          alt="Aurelia Grand Resort panoramic cliffside pool at dusk"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000 ease-out"
        />
        {/* Measured dark scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/60 to-[#121214]/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center text-white flex flex-col items-center">
        {/* Subtle Luxury Kicker */}
        <div className="text-xs uppercase tracking-[0.3em] text-[#E0CEB5] font-medium mb-4 flex items-center gap-2">
          <span>Cap d’Antibes Private Peninsula</span>
          <span aria-hidden="true">·</span>
          <span>Five-Star Grand Luxury</span>
        </div>

        {/* Display Headline with text-wrap balance */}
        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white mb-6 leading-[1.08] max-w-4xl"
          style={{ textWrap: 'balance' }}
        >
          Where Mediterranean Splendor Meets Unrivaled Serenity
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl font-light leading-relaxed mb-12">
          A secluded coastal sanctuary offering private plunge pool villas, personalized butler care,
          and Michelin-starred gastronomy overlooking the azure sea.
        </p>

        {/* Luxury Booking Console Card */}
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md text-[#1E1E24] shadow-2xl p-4 sm:p-6 border border-white/80 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Check-In Date */}
            <div className="flex flex-col border-b sm:border-b-0 sm:border-r border-[#E8E5DD] pb-3 sm:pb-0 sm:pr-4">
              <label htmlFor="check-in-date" className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A82] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                Check-in Date
              </label>
              <input
                id="check-in-date"
                type="date"
                value={searchCriteria.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => onSearchChange({ checkIn: e.target.value })}
                className="text-sm font-medium text-[#1E1E24] bg-transparent focus:outline-hidden cursor-pointer"
              />
              <span className="text-[11px] text-[#9A9A9E] mt-0.5">From 3:00 PM</span>
            </div>

            {/* Check-Out Date */}
            <div className="flex flex-col border-b sm:border-b-0 sm:border-r border-[#E8E5DD] pb-3 sm:pb-0 sm:pr-4">
              <label htmlFor="check-out-date" className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A82] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                Check-out Date
              </label>
              <input
                id="check-out-date"
                type="date"
                value={searchCriteria.checkOut}
                min={searchCriteria.checkIn}
                onChange={(e) => onSearchChange({ checkOut: e.target.value })}
                className="text-sm font-medium text-[#1E1E24] bg-transparent focus:outline-hidden cursor-pointer"
              />
              <span className="text-[11px] text-[#9A9A9E] mt-0.5">
                {nights} {nights === 1 ? 'Night' : 'Nights'} Stay
              </span>
            </div>

            {/* Guests & Rooms */}
            <div id="guest-picker-container" className="relative flex flex-col border-b sm:border-b-0 lg:border-r border-[#E8E5DD] pb-3 sm:pb-0 lg:pr-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A82] mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                Guests & Rooms
              </span>
              <button
                type="button"
                onClick={() => setGuestPickerOpen(!guestPickerOpen)}
                className="flex items-center justify-between text-sm font-medium text-[#1E1E24] hover:text-[#C5A880] transition-colors py-0.5 text-left"
              >
                <span>
                  {searchCriteria.adults + searchCriteria.children} Guests · {searchCriteria.rooms} {searchCriteria.rooms === 1 ? 'Room' : 'Rooms'}
                </span>
                <ChevronDown className="w-4 h-4 text-[#7A7A82]" />
              </button>
              <span className="text-[11px] text-[#9A9A9E] mt-0.5">
                {searchCriteria.adults} Adults, {searchCriteria.children} Children
              </span>

              {/* Guests popover dropdown */}
              {guestPickerOpen && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-white shadow-xl border border-[#E7E4DC] p-4 z-50 animate-fadeIn">
                  {/* Adults */}
                  <div className="flex items-center justify-between py-2 border-b border-[#F0ECE1]">
                    <div>
                      <div className="text-xs font-semibold text-[#1E1E24]">Adults</div>
                      <div className="text-[11px] text-[#808088]">Age 13+</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSearchChange({ adults: Math.max(1, searchCriteria.adults - 1) })}
                        disabled={searchCriteria.adults <= 1}
                        className="w-7 h-7 flex items-center justify-center border border-[#D9D6CE] text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1E1E24]"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-semibold tabular-nums">{searchCriteria.adults}</span>
                      <button
                        type="button"
                        onClick={() => onSearchChange({ adults: Math.min(8, searchCriteria.adults + 1) })}
                        disabled={searchCriteria.adults >= 8}
                        className="w-7 h-7 flex items-center justify-center border border-[#D9D6CE] text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1E1E24]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between py-2 border-b border-[#F0ECE1]">
                    <div>
                      <div className="text-xs font-semibold text-[#1E1E24]">Children</div>
                      <div className="text-[11px] text-[#808088]">Ages 0–12</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSearchChange({ children: Math.max(0, searchCriteria.children - 1) })}
                        disabled={searchCriteria.children <= 0}
                        className="w-7 h-7 flex items-center justify-center border border-[#D9D6CE] text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1E1E24]"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-semibold tabular-nums">{searchCriteria.children}</span>
                      <button
                        type="button"
                        onClick={() => onSearchChange({ children: Math.min(4, searchCriteria.children + 1) })}
                        disabled={searchCriteria.children >= 4}
                        className="w-7 h-7 flex items-center justify-center border border-[#D9D6CE] text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1E1E24]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="flex items-center justify-between py-2 pt-3">
                    <div>
                      <div className="text-xs font-semibold text-[#1E1E24]">Rooms</div>
                      <div className="text-[11px] text-[#808088]">Accommodations</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSearchChange({ rooms: Math.max(1, searchCriteria.rooms - 1) })}
                        disabled={searchCriteria.rooms <= 1}
                        className="w-7 h-7 flex items-center justify-center border border-[#D9D6CE] text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1E1E24]"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-semibold tabular-nums">{searchCriteria.rooms}</span>
                      <button
                        type="button"
                        onClick={() => onSearchChange({ rooms: Math.min(4, searchCriteria.rooms + 1) })}
                        disabled={searchCriteria.rooms >= 4}
                        className="w-7 h-7 flex items-center justify-center border border-[#D9D6CE] text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1E1E24]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Availability Action Button */}
            <div className="pt-2 sm:pt-0">
              <button
                type="button"
                onClick={onCheckAvailability}
                className="w-full bg-[#1E1E24] hover:bg-[#C5A880] text-white py-3.5 px-4 font-semibold text-xs uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2 group cursor-pointer shadow-md"
              >
                <span>Find Available Suites</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Reassurance Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-white/80 font-light">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#E0CEB5]" />
            <span>Guaranteed Best Direct Booking Rates</span>
          </div>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E0CEB5]" />
            <span>Complimentary Champagne Upon Arrival</span>
          </div>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>Free Cancellation up to 48 Hours Before Check-in</span>
        </div>
      </div>
    </section>
  );
};
