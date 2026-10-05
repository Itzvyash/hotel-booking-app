/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchFilterBar } from './components/SearchFilterBar';
import { RoomCard } from './components/RoomCard';
import { RoomDetailModal } from './components/RoomDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { MyReservationsModal } from './components/MyReservationsModal';
import { ExperiencesSection } from './components/ExperiencesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { ROOMS_DATA } from './data/hotelData';
import { BookingSearchCriteria, Reservation, Room } from './types/hotel';
import { calculateNights, getSavedReservations } from './utils/bookingUtils';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  // Stay dates default: 3 days in future for 4 nights stay
  const defaultDates = useMemo(() => {
    const today = new Date();
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + 5);

    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 4);

    return {
      checkIn: checkInDate.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0],
    };
  }, []);

  const [searchCriteria, setSearchCriteria] = useState<BookingSearchCriteria>({
    checkIn: defaultDates.checkIn,
    checkOut: defaultDates.checkOut,
    adults: 2,
    children: 0,
    rooms: 1,
    category: 'all',
    priceRange: [0, 5000],
    bedType: 'all',
    view: 'all',
    sortBy: 'recommended',
  });

  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refresh saved bookings count
  const refreshBookingsCount = () => {
    const saved = getSavedReservations();
    const active = saved.filter((r) => r.status === 'confirmed').length;
    setActiveBookingsCount(active);
  };

  useEffect(() => {
    refreshBookingsCount();
  }, []);

  // Show temporary toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Scroll to section helper
  const scrollToRooms = () => {
    const el = document.getElementById('rooms-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToExperiences = () => {
    const el = document.getElementById('experiences-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSpa = () => {
    const el = document.getElementById('wellness-sanctuary');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter & Sort Rooms
  const filteredRooms = useMemo(() => {
    return ROOMS_DATA.filter((room) => {
      // Category filter
      if (searchCriteria.category !== 'all' && room.category !== searchCriteria.category) {
        return false;
      }
      // Bedding filter
      if (searchCriteria.bedType !== 'all' && room.bedType !== searchCriteria.bedType) {
        return false;
      }
      // View filter
      if (searchCriteria.view !== 'all' && room.view !== searchCriteria.view) {
        return false;
      }
      // Capacity check: room max guests vs requested adults + children
      const totalGuests = searchCriteria.adults + searchCriteria.children;
      if (room.capacity.maxGuests < totalGuests) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (searchCriteria.sortBy === 'price-low') {
        return a.pricePerNight - b.pricePerNight;
      }
      if (searchCriteria.sortBy === 'price-high') {
        return b.pricePerNight - a.pricePerNight;
      }
      if (searchCriteria.sortBy === 'size') {
        return b.sizeSqm - a.sizeSqm;
      }
      // Recommended: popular first then rating
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return b.rating - a.rating;
    });
  }, [searchCriteria]);

  const nights = calculateNights(searchCriteria.checkIn, searchCriteria.checkOut);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E1E24] flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-[#1A1A1A]">
      {/* Top Navbar */}
      <Navbar
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onNavigateToRooms={scrollToRooms}
        onNavigateToExperiences={scrollToExperiences}
        onNavigateToDining={scrollToExperiences}
        onNavigateToSpa={scrollToSpa}
        activeBookingsCount={activeBookingsCount}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Hero Section with Interactive Booking Bar */}
      <HeroSection
        searchCriteria={searchCriteria}
        onSearchChange={(changes) => setSearchCriteria((prev) => ({ ...prev, ...changes }))}
        onCheckAvailability={scrollToRooms}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E24] text-white px-5 py-3.5 shadow-2xl border border-[#C5A880]/40 flex items-center gap-3 animate-fadeIn text-xs">
          <div className="w-5 h-5 rounded-full bg-[#C5A880] text-[#1E1E24] flex items-center justify-center font-bold">
            ✓
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Rooms Showcase Section */}
      <main id="rooms-section" className="scroll-mt-20">
        {/* Sticky Filter Bar */}
        <SearchFilterBar
          searchCriteria={searchCriteria}
          onSearchChange={(changes) => setSearchCriteria((prev) => ({ ...prev, ...changes }))}
          resultsCount={filteredRooms.length}
        />

        {/* Room Grid Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mb-10">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-2">
              Bespoke Sanctuaries
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[#1E1E24] tracking-tight">
              Curated Suites & Oceanfront Residences
            </h2>
            <p className="text-xs sm:text-sm text-[#6A6A74] mt-2 font-light leading-relaxed">
              Featuring floor-to-ceiling panoramic vistas, private infinity plunge pools, and personalized round-the-clock butler attention.
            </p>
          </div>

          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  nights={nights}
                  currency={currency}
                  onViewDetails={(r) => setSelectedRoomForDetail(r)}
                  onSelectRoom={(r) => setSelectedRoomForBooking(r)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-[#E7E4DC] p-8 max-w-xl mx-auto">
              <h3 className="font-display text-xl text-[#1E1E24] mb-2">No Matching Accommodations</h3>
              <p className="text-xs text-[#70707A] mb-6">
                No suites currently meet all your filter criteria. Try adjusting guest count, bed configuration, or resetting filters.
              </p>
              <button
                onClick={() =>
                  setSearchCriteria((prev) => ({
                    ...prev,
                    category: 'all',
                    bedType: 'all',
                    view: 'all',
                    adults: 2,
                    children: 0,
                  }))
                }
                className="bg-[#1E1E24] hover:bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-6 transition-colors cursor-pointer"
              >
                Reset All Search Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Resort Experiences Section */}
      <div id="experiences-section">
        <ExperiencesSection onExploreSuites={scrollToRooms} />
      </div>

      {/* Guest Reviews & Social Proof */}
      <ReviewsSection />

      {/* Editorial Footer */}
      <Footer />

      {/* Room Detail Modal */}
      {selectedRoomForDetail && (
        <RoomDetailModal
          room={selectedRoomForDetail}
          nights={nights}
          currency={currency}
          onClose={() => setSelectedRoomForDetail(null)}
          onSelectRoom={(room) => {
            setSelectedRoomForDetail(null);
            setSelectedRoomForBooking(room);
          }}
        />
      )}

      {/* Secure Checkout & Payment Processing Modal */}
      {selectedRoomForBooking && (
        <CheckoutModal
          room={selectedRoomForBooking}
          searchCriteria={searchCriteria}
          currency={currency}
          onClose={() => setSelectedRoomForBooking(null)}
          onBookingSuccess={(reservation) => {
            refreshBookingsCount();
            triggerToast(`Reservation ${reservation.confirmationCode} confirmed successfully!`);
          }}
        />
      )}

      {/* My Reservations Management Modal */}
      <MyReservationsModal
        isOpen={isMyBookingsOpen}
        currency={currency}
        onClose={() => setIsMyBookingsOpen(false)}
        onRefreshBookingsCount={refreshBookingsCount}
      />
    </div>
  );
}
