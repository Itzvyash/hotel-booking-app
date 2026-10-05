import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Check, X } from 'lucide-react';
import { BookingSearchCriteria, RoomCategory } from '../types/hotel';

interface SearchFilterBarProps {
  searchCriteria: BookingSearchCriteria;
  onSearchChange: (newCriteria: Partial<BookingSearchCriteria>) => void;
  resultsCount: number;
}

const CATEGORIES: { label: string; value: RoomCategory }[] = [
  { label: 'All Accommodations', value: 'all' },
  { label: 'Oceanfront Villas', value: 'villa' },
  { label: 'Penthouse Residences', value: 'penthouse' },
  { label: 'Coastal Suites', value: 'suite' },
  { label: 'Garden Pavilions', value: 'garden' },
];

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchCriteria,
  onSearchChange,
  resultsCount,
}) => {
  const [showDetailedFilters, setShowDetailedFilters] = React.useState(false);

  return (
    <div className="bg-[#FAF9F5] border-y border-[#E8E5DD] sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Segmented Category Buttons (interactive filter controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isActive = searchCriteria.category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => onSearchChange({ category: cat.value })}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all cursor-pointer rounded-xs ${
                    isActive
                      ? 'bg-[#1E1E24] text-white shadow-xs'
                      : 'bg-[#F2EFE9] text-[#55555D] hover:bg-[#EAE6DD] hover:text-[#1E1E24]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right Action: Filter toggle, Sort & Count */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            {/* Results count (clean unboxed text) */}
            <div className="text-xs text-[#73737C] font-normal">
              <span className="font-semibold text-[#1E1E24] tabular-nums">{resultsCount}</span> {resultsCount === 1 ? 'Suite Available' : 'Suites Available'}
            </div>

            <div className="flex items-center gap-2">
              {/* Filter expander toggle */}
              <button
                type="button"
                onClick={() => setShowDetailedFilters(!showDetailedFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer rounded-xs ${
                  showDetailedFilters || searchCriteria.bedType !== 'all' || searchCriteria.view !== 'all'
                    ? 'border-[#1E1E24] bg-[#1E1E24] text-white'
                    : 'border-[#D9D6CE] text-[#3E3E46] hover:border-[#1E1E24]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {(searchCriteria.bedType !== 'all' || searchCriteria.view !== 'all') && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                )}
              </button>

              {/* Sort By dropdown */}
              <div className="flex items-center gap-1 border border-[#D9D6CE] px-2 py-1 bg-white rounded-xs">
                <ArrowUpDown className="w-3 h-3 text-[#73737C]" />
                <select
                  value={searchCriteria.sortBy}
                  onChange={(e) => onSearchChange({ sortBy: e.target.value as any })}
                  className="text-xs font-medium text-[#1E1E24] bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="recommended">Featured & Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="size">Size: Largest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Advanced Filters Tray */}
        {showDetailedFilters && (
          <div className="mt-4 pt-4 border-t border-[#E8E5DD] grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeIn pb-2">
            {/* Bed Configuration */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#73737C] mb-2">
                Bedding Configuration
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Any Bed' },
                  { id: '1 King Bed', label: 'King Bed' },
                  { id: '1 King Bed or 2 Queens', label: 'King / 2 Queens' },
                  { id: '2 King Beds', label: '2 King Beds' },
                ].map((bed) => (
                  <button
                    key={bed.id}
                    onClick={() => onSearchChange({ bedType: bed.id })}
                    className={`px-2.5 py-1 text-xs border rounded-xs transition-colors cursor-pointer ${
                      searchCriteria.bedType === bed.id
                        ? 'bg-[#1E1E24] text-white border-[#1E1E24]'
                        : 'bg-white text-[#4A4A52] border-[#D9D6CE] hover:border-[#1E1E24]'
                    }`}
                  >
                    {bed.label}
                  </button>
                ))}
              </div>
            </div>

            {/* View Direction */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#73737C] mb-2">
                View & Orientation
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Views' },
                  { id: 'Panoramic Ocean', label: 'Ocean View' },
                  { id: 'Private Zen Garden', label: 'Zen Garden' },
                  { id: 'Skyline & Bay', label: 'Skyline & Bay' },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => onSearchChange({ view: v.id })}
                    className={`px-2.5 py-1 text-xs border rounded-xs transition-colors cursor-pointer ${
                      searchCriteria.view === v.id
                        ? 'bg-[#1E1E24] text-white border-[#1E1E24]'
                        : 'bg-white text-[#4A4A52] border-[#D9D6CE] hover:border-[#1E1E24]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters Reset */}
            <div className="flex items-end justify-start sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  onSearchChange({
                    category: 'all',
                    bedType: 'all',
                    view: 'all',
                    priceRange: [0, 5000],
                  })
                }
                className="text-xs text-[#73737C] hover:text-[#1E1E24] underline cursor-pointer py-1"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
