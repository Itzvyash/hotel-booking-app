import { AddOnOption, BookingSearchCriteria, PaymentSummary, Reservation } from '../types/hotel';

export const STORAGE_KEY = 'aurelia_grand_reservations';

export function calculateNights(checkInStr: string, checkOutStr: string): number {
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
}

export function formatPrice(amount: number, currency: 'USD' | 'EUR' | 'GBP' = 'USD'): string {
  const rates = { USD: 1, EUR: 0.92, GBP: 0.79 };
  const symbols = { USD: '$', EUR: '€', GBP: '£' };
  const converted = Math.round(amount * rates[currency]);
  return `${symbols[currency]}${converted.toLocaleString()}`;
}

export function calculatePaymentBreakdown(
  pricePerNight: number,
  nights: number,
  adults: number,
  selectedAddOns: AddOnOption[],
  promoDiscount: { percent?: number; fixed?: number } | null = null
): PaymentSummary {
  const basePricePerNight = pricePerNight;
  const subtotal = basePricePerNight * nights;

  let addOnsTotal = 0;
  for (const addon of selectedAddOns) {
    if (addon.billingType === 'per_stay') {
      addOnsTotal += addon.price;
    } else if (addon.billingType === 'per_night') {
      addOnsTotal += addon.price * nights;
    } else if (addon.billingType === 'per_guest') {
      addOnsTotal += addon.price * adults * nights;
    }
  }

  const rawBeforeDiscount = subtotal + addOnsTotal;

  let discountAmount = 0;
  if (promoDiscount) {
    if (promoDiscount.percent) {
      discountAmount = Math.round((subtotal * promoDiscount.percent) / 100);
    } else if (promoDiscount.fixed) {
      discountAmount = Math.min(rawBeforeDiscount, promoDiscount.fixed);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxes = Math.round(taxableAmount * 0.12); // 12% luxury occupancy tax
  const resortFee = 35 * nights; // $35/night luxury resort & wellness facility fee

  const grandTotal = Math.max(0, subtotal + addOnsTotal + taxes + resortFee - discountAmount);

  return {
    nights,
    basePricePerNight,
    subtotal,
    addOnsTotal,
    taxes,
    resortFee,
    discountAmount,
    grandTotal,
  };
}

export function detectCardType(number: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic' {
  const cleaned = number.replace(/\s+/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(011|5)/.test(cleaned)) return 'discover';
  return 'generic';
}

export function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
}

export function formatExpiryDate(value: string): string {
  const clean = value.replace(/[^0-9]/g, '');
  if (clean.length >= 2) {
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  }
  return clean;
}

export function getSavedReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveReservation(reservation: Reservation): void {
  try {
    const existing = getSavedReservations();
    const updated = [reservation, ...existing.filter((r) => r.id !== reservation.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save reservation:', err);
  }
}

export function cancelReservationInStorage(id: string): void {
  try {
    const existing = getSavedReservations();
    const updated = existing.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to cancel reservation:', err);
  }
}

export function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'AUR-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export function getFormattedDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
