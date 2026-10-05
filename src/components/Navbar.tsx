import React from 'react';
import { Calendar, ShoppingBag, ShieldCheck, Globe, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenMyBookings: () => void;
  onNavigateToRooms: () => void;
  onNavigateToExperiences: () => void;
  onNavigateToDining: () => void;
  onNavigateToSpa: () => void;
  activeBookingsCount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  onCurrencyChange: (c: 'USD' | 'EUR' | 'GBP') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMyBookings,
  onNavigateToRooms,
  onNavigateToExperiences,
  onNavigateToDining,
  onNavigateToSpa,
  activeBookingsCount,
  currency,
  onCurrencyChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E7E4DC] shadow-xs'
          : 'bg-gradient-to-b from-[#121214]/80 via-[#121214]/40 to-transparent text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`font-display text-2xl sm:text-3xl font-normal tracking-[0.2em] uppercase transition-colors ${
            isScrolled ? 'text-[#1E1E24]' : 'text-white'
          }`}
        >
          Aurelia Grand
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-xs uppercase tracking-[0.18em] font-medium">
          <button
            onClick={onNavigateToRooms}
            className={`hover:text-[#C5A880] transition-colors whitespace-nowrap cursor-pointer ${
              isScrolled ? 'text-[#4A4A52]' : 'text-white/90'
            }`}
          >
            Suites & Villas
          </button>
          <button
            onClick={onNavigateToExperiences}
            className={`hover:text-[#C5A880] transition-colors whitespace-nowrap cursor-pointer ${
              isScrolled ? 'text-[#4A4A52]' : 'text-white/90'
            }`}
          >
            Experiences
          </button>
          <button
            onClick={onNavigateToDining}
            className={`hover:text-[#C5A880] transition-colors whitespace-nowrap cursor-pointer ${
              isScrolled ? 'text-[#4A4A52]' : 'text-white/90'
            }`}
          >
            Gastronomy
          </button>
          <button
            onClick={onNavigateToSpa}
            className={`hover:text-[#C5A880] transition-colors whitespace-nowrap cursor-pointer ${
              isScrolled ? 'text-[#4A4A52]' : 'text-white/90'
            }`}
          >
            Wellness
          </button>
          <button
            onClick={onOpenMyBookings}
            className={`relative flex items-center gap-1.5 hover:text-[#C5A880] transition-colors whitespace-nowrap cursor-pointer ${
              isScrolled ? 'text-[#4A4A52]' : 'text-white/90'
            }`}
          >
            <span>Reservations</span>
            {activeBookingsCount > 0 && (
              <span className="w-4 h-4 bg-[#C5A880] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                {activeBookingsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Currency dropdown */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as 'USD' | 'EUR' | 'GBP')}
              aria-label="Select currency"
              className={`text-xs font-medium uppercase tracking-wider py-1.5 px-2.5 rounded-sm border cursor-pointer transition-colors bg-transparent ${
                isScrolled
                  ? 'border-[#D9D6CE] text-[#333339] hover:border-[#C5A880]'
                  : 'border-white/30 text-white hover:border-white/60'
              }`}
            >
              <option value="USD" className="bg-[#FAF9F5] text-[#1E1E24]">USD ($)</option>
              <option value="EUR" className="bg-[#FAF9F5] text-[#1E1E24]">EUR (€)</option>
              <option value="GBP" className="bg-[#FAF9F5] text-[#1E1E24]">GBP (£)</option>
            </select>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onNavigateToRooms}
            className={`px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200 cursor-pointer ${
              isScrolled
                ? 'bg-[#1E1E24] text-white hover:bg-[#C5A880] hover:text-[#1E1E24]'
                : 'bg-white text-[#1E1E24] hover:bg-[#C5A880] hover:text-white'
            }`}
          >
            Reserve Stay
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-md ${
              isScrolled ? 'text-[#1E1E24]' : 'text-white'
            }`}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F5] border-b border-[#E7E4DC] px-6 py-6 text-[#1E1E24] shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-4 text-sm font-medium tracking-wide">
            <button
              onClick={() => {
                onNavigateToRooms();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#EFECE6] hover:text-[#C5A880]"
            >
              Suites & Villas
            </button>
            <button
              onClick={() => {
                onNavigateToExperiences();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#EFECE6] hover:text-[#C5A880]"
            >
              Experiences
            </button>
            <button
              onClick={() => {
                onNavigateToDining();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#EFECE6] hover:text-[#C5A880]"
            >
              Gastronomy
            </button>
            <button
              onClick={() => {
                onNavigateToSpa();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#EFECE6] hover:text-[#C5A880]"
            >
              Wellness & Spa
            </button>
            <button
              onClick={() => {
                onOpenMyBookings();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 flex items-center justify-between text-[#C5A880] font-semibold"
            >
              <span>My Reservations</span>
              {activeBookingsCount > 0 && (
                <span className="w-5 h-5 bg-[#C5A880] text-white text-xs rounded-full flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
