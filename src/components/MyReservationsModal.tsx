import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, QrCode, Printer, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Reservation } from '../types/hotel';
import { cancelReservationInStorage, formatPrice, getFormattedDate, getSavedReservations } from '../utils/bookingUtils';

interface MyReservationsModalProps {
  isOpen: boolean;
  currency: 'USD' | 'EUR' | 'GBP';
  onClose: () => void;
  onRefreshBookingsCount: () => void;
}

export const MyReservationsModal: React.FC<MyReservationsModalProps> = ({
  isOpen,
  currency,
  onClose,
  onRefreshBookingsCount,
}) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const data = getSavedReservations();
      setReservations(data);
      if (data.length > 0 && !selectedReservation) {
        setSelectedReservation(data[0]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCancelBooking = (id: string) => {
    cancelReservationInStorage(id);
    const updated = getSavedReservations();
    setReservations(updated);
    if (selectedReservation?.id === id) {
      setSelectedReservation(updated.find((r) => r.id === id) || null);
    }
    setCancelModalId(null);
    onRefreshBookingsCount();
  };

  const filteredReservations = reservations.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.confirmationCode.toLowerCase().includes(q) ||
      r.guest.email.toLowerCase().includes(q) ||
      r.guest.lastName.toLowerCase().includes(q) ||
      r.room.name.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF9F5] text-[#1E1E24] max-w-4xl w-full border border-[#E7E4DC] shadow-2xl overflow-hidden my-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1E1E24] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-display text-xl uppercase tracking-wider font-normal">
              My Reservations & Digital Keys
            </span>
            <span className="block text-[11px] text-white/60 font-light mt-0.5">
              Retrieve confirmation details, print vouchers, or manage your stay
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Lookup Input */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search by Confirmation Code (e.g. AUR-...) or Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#D9D6CE] pl-9 pr-4 py-2.5 text-xs text-[#1E1E24] focus:outline-hidden focus:border-[#1E1E24]"
              />
              <Search className="w-4 h-4 text-[#8A8A92] absolute left-3 top-3" />
            </div>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="text-center py-12 bg-white border border-[#EAE6DE] p-8">
              <Clock className="w-10 h-10 text-[#C5A880] mx-auto mb-3 opacity-80" />
              <h3 className="font-display text-lg text-[#1E1E24]">No Reservations Found</h3>
              <p className="text-xs text-[#70707A] max-w-sm mx-auto mt-1 mb-6">
                You do not have any active or past reservations under this search query yet. Select any suite to book your retreat.
              </p>
              <button
                onClick={onClose}
                className="bg-[#1E1E24] hover:bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-6 transition-colors cursor-pointer"
              >
                Browse Suites & Villas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* List Column */}
              <div className="md:col-span-5 space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#73737C]">
                  Reservations ({filteredReservations.length})
                </div>

                {filteredReservations.map((res) => {
                  const isSelected = selectedReservation?.id === res.id;
                  const isCancelled = res.status === 'cancelled';
                  return (
                    <div
                      key={res.id}
                      onClick={() => setSelectedReservation(res)}
                      className={`p-3.5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#1E1E24] shadow-xs'
                          : 'bg-[#F5F2EB] border-[#E5E1D5] hover:border-[#C5A880]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold tracking-wider text-[#1E1E24]">
                          {res.confirmationCode}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 ${
                            isCancelled
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>

                      <div className="font-display text-sm font-medium text-[#1E1E24] truncate">
                        {res.room.name}
                      </div>

                      <div className="text-[11px] text-[#70707A] mt-1 flex items-center justify-between">
                        <span>
                          {getFormattedDate(res.searchCriteria.checkIn).slice(0, 11)} —{' '}
                          {getFormattedDate(res.searchCriteria.checkOut).slice(0, 11)}
                        </span>
                        <span className="font-medium text-[#1E1E24] tabular-nums">
                          {formatPrice(res.paymentSummary.grandTotal, currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Details Column */}
              <div className="md:col-span-7">
                {selectedReservation ? (
                  <div className="bg-white border border-[#E7E4DC] p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#8A8A92]">
                          Booking Reference
                        </div>
                        <div className="font-mono text-xl font-bold tracking-widest text-[#1E1E24]">
                          {selectedReservation.confirmationCode}
                        </div>
                      </div>

                      <div className="w-12 h-12 bg-[#1E1E24] text-white p-1 flex items-center justify-center">
                        <QrCode className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase text-[#888892] block">Reserved Suite</span>
                        <span className="font-display text-lg text-[#1E1E24] block">
                          {selectedReservation.room.name}
                        </span>
                        <span className="text-xs text-[#70707A]">
                          {selectedReservation.room.view} · {selectedReservation.room.bedType}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 py-2 border-y border-[#F0ECE4]">
                        <div>
                          <span className="text-[10px] uppercase text-[#888892] block">Check-in</span>
                          <span className="font-medium text-[#1E1E24]">
                            {getFormattedDate(selectedReservation.searchCriteria.checkIn)} (3:00 PM)
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#888892] block">Check-out</span>
                          <span className="font-medium text-[#1E1E24]">
                            {getFormattedDate(selectedReservation.searchCriteria.checkOut)} (12:00 PM)
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase text-[#888892] block">Guest Name & Contact</span>
                        <span className="font-medium text-[#1E1E24]">
                          {selectedReservation.guest.title} {selectedReservation.guest.firstName}{' '}
                          {selectedReservation.guest.lastName}
                        </span>
                        <span className="block text-[#70707A] text-[11px]">
                          {selectedReservation.guest.email} · {selectedReservation.guest.phone}
                        </span>
                      </div>

                      {selectedReservation.addOns.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase text-[#888892] block">Enhancements</span>
                          <div className="text-[#4A4A52] text-xs">
                            {selectedReservation.addOns.map((a) => (
                              <div key={a.id}>• {a.name}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-[#F0ECE4] pt-3 flex justify-between items-baseline">
                        <span className="text-xs text-[#6D6D77]">Total Settled</span>
                        <span className="font-display text-xl font-semibold text-[#1E1E24] tabular-nums">
                          {formatPrice(selectedReservation.paymentSummary.grandTotal, currency)}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2 border border-[#D9D6CE] text-xs font-medium text-[#1E1E24] hover:bg-[#F4F1EA] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Confirmation</span>
                      </button>

                      {selectedReservation.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => setCancelModalId(selectedReservation.id)}
                          className="text-xs text-rose-700 hover:text-rose-900 font-medium underline cursor-pointer"
                        >
                          Request Cancellation
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-8 bg-white border border-[#E7E4DC] text-xs text-[#7A7A84]">
                    Select a reservation on the left to view details
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cancellation Confirmation Dialog */}
        {cancelModalId && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full p-6 shadow-xl border border-[#E7E4DC] space-y-4">
              <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Reservation Cancellation</span>
              </div>
              <p className="text-xs text-[#55555F] leading-relaxed">
                Are you sure you wish to cancel this reservation? Full refunds are eligible in accordance with the 48-hour flexible cancellation policy.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalId(null)}
                  className="px-4 py-2 border border-[#D9D6CE] text-xs font-medium text-[#333] hover:bg-[#F2ECE3] cursor-pointer"
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelBooking(cancelModalId)}
                  className="px-4 py-2 bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition-colors cursor-pointer"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
