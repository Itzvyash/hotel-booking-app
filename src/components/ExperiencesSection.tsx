import React from 'react';
import { Sparkles, Utensils, Waves, Compass } from 'lucide-react';
import { IMAGES } from '../data/hotelData';

interface ExperiencesSectionProps {
  onExploreSuites: () => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ onExploreSuites }) => {
  return (
    <section className="py-20 bg-[#FAF9F5] border-t border-[#E8E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-2">
            Sanctuary & Curated Living
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[#1E1E24] leading-tight">
            The Art of Coastal Living
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6C75] mt-3 font-light leading-relaxed">
            Every moment at Aurelia Grand is orchestrated with refined discretion, from Michelin-starred culinary artistry to restorative thermal spa sanctuaries.
          </p>
        </div>

        {/* 3 Pillars Bento / Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Gastronomy */}
          <div className="group bg-white border border-[#E7E4DC] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
            <div>
              <div className="aspect-4/3 overflow-hidden bg-[#ECE8E1]">
                <img
                  src={IMAGES.hero}
                  alt="Gastronomy at L'Orangerie"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold mb-1">
                  Gastronomy & Cellar
                </div>
                <h3 className="font-display text-2xl font-normal text-[#1E1E24] mb-2">
                  L’Orangerie & Sea Terrace
                </h3>
                <p className="text-xs text-[#63636E] leading-relaxed font-light">
                  Two-Michelin-starred culinary experiences led by Executive Chef Jean-Luc Laurent. Featuring wild Mediterranean seafood, heritage truffles, and a 2,400-label private cellar.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 border-t border-[#F2EEE6]">
              <div className="pt-3 text-xs text-[#7A7A84] flex items-center justify-between">
                <span>Breakfast · Lunch · Dinner</span>
                <span className="font-medium text-[#1E1E24]">Reserve with Stay</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Thermal Wellness Spa */}
          <div id="wellness-sanctuary" className="group bg-white border border-[#E7E4DC] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
            <div>
              <div className="aspect-4/3 overflow-hidden bg-[#ECE8E1]">
                <img
                  src={IMAGES.spaWellness}
                  alt="Hydrotherapy and Finnish Sauna Spa"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold mb-1">
                  Thermal Sanctuary
                </div>
                <h3 className="font-display text-2xl font-normal text-[#1E1E24] mb-2">
                  The Obsidian Spa & Bathhouse
                </h3>
                <p className="text-xs text-[#63636E] leading-relaxed font-light">
                  A multi-sensory restorative sanctuary carved into natural travertine stone. Heated hydrotherapy pools, Finnish cedar saunas, and custom botanical massage therapies.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 border-t border-[#F2EEE6]">
              <div className="pt-3 text-xs text-[#7A7A84] flex items-center justify-between">
                <span>Hydrotherapy · Steam · Rituals</span>
                <span className="font-medium text-[#1E1E24]">Complimentary for Guests</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Sea Excursions & Private Riva Yacht */}
          <div className="group bg-white border border-[#E7E4DC] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
            <div>
              <div className="aspect-4/3 overflow-hidden bg-[#ECE8E1]">
                <img
                  src={IMAGES.oceanVilla}
                  alt="Oceanfront Private Villa and Yacht Access"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold mb-1">
                  Private Maritime
                </div>
                <h3 className="font-display text-2xl font-normal text-[#1E1E24] mb-2">
                  Private Riva Yacht Charters
                </h3>
                <p className="text-xs text-[#63636E] leading-relaxed font-light">
                  Step from the resort’s private jetty onto custom 48-foot Riva yachts. Explore secluded sea caves, swim in turquoise lagoons, and enjoy sunset champagne service.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 border-t border-[#F2EEE6]">
              <div className="pt-3 text-xs text-[#7A7A84] flex items-center justify-between">
                <span>Private Captain & Sommelier</span>
                <span className="font-medium text-[#1E1E24]">Available as Add-On</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
