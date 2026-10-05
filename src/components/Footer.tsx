import React from 'react';
import { Phone, Mail, MapPin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#17171A] text-white/80 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-display text-2xl font-normal text-white uppercase tracking-[0.2em] block">
              Aurelia Grand
            </span>
            <p className="text-xs text-white/60 max-w-md font-light leading-relaxed">
              An iconic private peninsula retreat overlooking the azure Mediterranean. Dedicated to discrete luxury, timeless architecture, and restorative coastal hospitality.
            </p>
            <div className="flex flex-col space-y-2 text-xs text-white/70 pt-2 font-light">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>14 Boulevard de la Croisette, Cap d’Antibes, France</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>+33 (0)4 93 61 30 00 (Concierge & Reservations)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>reservations@aureliagrand.com</span>
              </div>
            </div>
          </div>

          {/* Suites & Rates */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880] mb-4">
              Accommodations
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-light">
              <li><a href="#rooms-section" className="hover:text-white transition-colors">Oceanfront Villas</a></li>
              <li><a href="#rooms-section" className="hover:text-white transition-colors">Penthouse Residences</a></li>
              <li><a href="#rooms-section" className="hover:text-white transition-colors">Coastal Premier Suites</a></li>
              <li><a href="#rooms-section" className="hover:text-white transition-colors">Garden Zen Pavilions</a></li>
              <li><a href="#rooms-section" className="hover:text-white transition-colors">The Presidential Residence</a></li>
            </ul>
          </div>

          {/* Sanctuary & Privileges */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880] mb-4">
              Direct Booking Guarantees
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-light">
              <li>· Best Rate Guarantee</li>
              <li>· Complimentary Welcome Champagne</li>
              <li>· Flexible 48-Hour Cancellation</li>
              <li>· Dedicated Private Concierge</li>
              <li>· 256-Bit Encrypted Payments</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <div>
            © {new Date().getFullYear()} Aurelia Grand Reserve & Suites. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white/70 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white/70 transition-colors cursor-pointer">Booking Terms</span>
            <span className="hover:text-white/70 transition-colors cursor-pointer">PCI-DSS Security Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
