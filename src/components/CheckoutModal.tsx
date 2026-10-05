import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Printer,
  QrCode,
  Tag,
  Car,
  Coffee,
  Heart,
  Ship,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  AddOnOption,
  BookingSearchCriteria,
  CardPaymentData,
  GuestDetails,
  PaymentMethod,
  PaymentSummary,
  Reservation,
  Room,
} from '../types/hotel';
import { ADD_ON_OPTIONS, PROMO_CODES } from '../data/hotelData';
import {
  calculateNights,
  calculatePaymentBreakdown,
  detectCardType,
  formatCardNumber,
  formatExpiryDate,
  formatPrice,
  generateBookingReference,
  getFormattedDate,
  saveReservation,
} from '../utils/bookingUtils';

interface CheckoutModalProps {
  room: Room;
  searchCriteria: BookingSearchCriteria;
  currency: 'USD' | 'EUR' | 'GBP';
  onClose: () => void;
  onBookingSuccess: (reservation: Reservation) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  room,
  searchCriteria,
  currency,
  onClose,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const nights = calculateNights(searchCriteria.checkIn, searchCriteria.checkOut);

  // Guest details state
  const [guest, setGuest] = useState<GuestDetails>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'United States',
    specialRequests: '',
    arrivalTime: '15:00',
    flightNumber: '',
    isCelebratingOccasion: false,
    occasionDetails: '',
  });

  // Selected add-ons
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    percent?: number;
    fixed?: number;
    label: string;
  } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Payment method & card details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardData, setCardData] = useState<CardPaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingZip: '',
    saveCardForFuture: true,
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Completed reservation state
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Addon selection toggle
  const toggleAddOn = (addonId: string) => {
    if (selectedAddOnIds.includes(addonId)) {
      setSelectedAddOnIds(selectedAddOnIds.filter((id) => id !== addonId));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, addonId]);
    }
  };

  // Resolve selected addon objects
  const selectedAddOns = ADD_ON_OPTIONS.filter((a) => selectedAddOnIds.includes(a.id));

  // Compute breakdown
  const paymentSummary: PaymentSummary = calculatePaymentBreakdown(
    room.pricePerNight,
    nights,
    searchCriteria.adults,
    selectedAddOns,
    appliedPromo ? { percent: appliedPromo.percent, fixed: appliedPromo.fixed } : null
  );

  // Validate step 1
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!guest.firstName.trim()) errs.firstName = 'First name is required';
    if (!guest.lastName.trim()) errs.lastName = 'Last name is required';
    if (!guest.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!guest.phone.trim()) errs.phone = 'Phone number is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate step 3 (payment)
  const validatePayment = (): boolean => {
    if (paymentMethod === 'apple_pay' || paymentMethod === 'google_pay' || paymentMethod === 'arrival_guarantee') {
      return true;
    }

    const errs: Record<string, string> = {};
    const cleanNum = cardData.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      errs.cardNumber = 'Please enter a valid 15 or 16 digit card number';
    }
    if (!cardData.cardHolder.trim()) {
      errs.cardHolder = 'Cardholder name is required as shown on card';
    }
    if (cardData.expiryDate.length < 5) {
      errs.expiryDate = 'Valid MM/YY is required';
    }
    if (cardData.cvv.length < 3) {
      errs.cvv = '3 or 4 digit security code required';
    }
    if (!cardData.billingZip.trim()) {
      errs.billingZip = 'Postal code is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Apply promo code handler
  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      setAppliedPromo({
        code,
        percent: PROMO_CODES[code].discountPercent,
        fixed: PROMO_CODES[code].discountFixed,
        label: PROMO_CODES[code].label,
      });
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid promotion code. Try WELCOME10 or AURELIAVIP');
    }
  };

  // Handle final checkout processing
  const handleProcessPayment = () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    // Simulate high-security bank verification & payment gateway handshake
    setTimeout(() => {
      const code = generateBookingReference();
      const cardType = detectCardType(cardData.cardNumber);
      const cleanNum = cardData.cardNumber.replace(/\s+/g, '');
      const lastFour = cleanNum.slice(-4) || '4242';

      const reservation: Reservation = {
        id: `res-${Date.now()}`,
        confirmationCode: code,
        room,
        searchCriteria: {
          checkIn: searchCriteria.checkIn,
          checkOut: searchCriteria.checkOut,
          adults: searchCriteria.adults,
          children: searchCriteria.children,
          rooms: searchCriteria.rooms,
        },
        guest,
        addOns: selectedAddOns,
        paymentMethod,
        paymentSummary: {
          ...paymentSummary,
          discountCode: appliedPromo?.code,
        },
        paymentStatus: paymentMethod === 'arrival_guarantee' ? 'guaranteed_arrival' : 'paid',
        cardLastFour: lastFour,
        cardBrand: cardType.toUpperCase(),
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };

      saveReservation(reservation);
      setConfirmedReservation(reservation);
      setIsProcessing(false);
      setStep(4);
      onBookingSuccess(reservation);
    }, 1400);
  };

  const cardType = detectCardType(cardData.cardNumber);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={step === 4 ? undefined : onClose}
    >
      <div
        className="relative bg-[#FAF9F5] text-[#1E1E24] max-w-5xl w-full border border-[#E7E4DC] shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#1E1E24] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl tracking-wider uppercase font-normal">
              Aurelia Grand Reserve
            </span>
            <span className="hidden sm:inline text-white/40" aria-hidden="true">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#E0CEB5] font-light">
              <Lock className="w-3 h-3 text-[#E0CEB5]" />
              <span>256-Bit Encrypted Secure Reservation</span>
            </span>
          </div>

          {step !== 4 && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Tracker (Clean editorial numbered flow) */}
        {step !== 4 && (
          <div className="bg-white border-b border-[#E8E5DD] px-6 py-3">
            <div className="flex items-center justify-between max-w-2xl mx-auto text-xs">
              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  step === 1 ? 'font-semibold text-[#1E1E24]' : 'text-[#82828C]'
                }`}
                onClick={() => setStep(1)}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 1 ? 'bg-[#1E1E24] text-white' : 'bg-[#EAE7DF] text-[#6E6E77]'
                }`}>
                  1
                </span>
                <span>Guest Details</span>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-[#C9C6BE]" />

              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  step === 2 ? 'font-semibold text-[#1E1E24]' : 'text-[#82828C]'
                }`}
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 2 ? 'bg-[#1E1E24] text-white' : 'bg-[#EAE7DF] text-[#6E6E77]'
                }`}>
                  2
                </span>
                <span>Enhancements</span>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-[#C9C6BE]" />

              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  step === 3 ? 'font-semibold text-[#1E1E24]' : 'text-[#82828C]'
                }`}
                onClick={() => {
                  if (validateStep1()) setStep(3);
                }}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 3 ? 'bg-[#1E1E24] text-white' : 'bg-[#EAE7DF] text-[#6E6E77]'
                }`}>
                  3
                </span>
                <span>Payment & Guarantee</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 sm:p-8 max-h-[76vh] overflow-y-auto">
          {/* STEP 1: GUEST DETAILS */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-normal text-[#1E1E24] mb-1">
                    Primary Guest & Contact Information
                  </h2>
                  <p className="text-xs text-[#70707A] font-light">
                    Your reservation details and room key access pass will be delivered to this address.
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-6 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                      Title
                    </label>
                    <select
                      value={guest.title}
                      onChange={(e) => setGuest({ ...guest, title: e.target.value })}
                      className="w-full bg-white border border-[#D9D6CE] p-2.5 text-xs text-[#1E1E24] focus:outline-hidden focus:border-[#1E1E24]"
                    >
                      <option value="Mr">Mr.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Dr">Dr.</option>
                      <option value="Lord">Lord</option>
                      <option value="Lady">Lady</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alexander"
                      value={guest.firstName}
                      onChange={(e) => {
                        setGuest({ ...guest, firstName: e.target.value });
                        if (errors.firstName) setErrors({ ...errors, firstName: '' });
                      }}
                      className={`w-full bg-white border p-2.5 text-xs text-[#1E1E24] focus:outline-hidden ${
                        errors.firstName ? 'border-rose-500' : 'border-[#D9D6CE] focus:border-[#1E1E24]'
                      }`}
                    />
                    {errors.firstName && <p className="text-[10px] text-rose-600 mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vance"
                      value={guest.lastName}
                      onChange={(e) => {
                        setGuest({ ...guest, lastName: e.target.value });
                        if (errors.lastName) setErrors({ ...errors, lastName: '' });
                      }}
                      className={`w-full bg-white border p-2.5 text-xs text-[#1E1E24] focus:outline-hidden ${
                        errors.lastName ? 'border-rose-500' : 'border-[#D9D6CE] focus:border-[#1E1E24]'
                      }`}
                    />
                    {errors.lastName && <p className="text-[10px] text-rose-600 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="alexander@example.com"
                      value={guest.email}
                      onChange={(e) => {
                        setGuest({ ...guest, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full bg-white border p-2.5 text-xs text-[#1E1E24] focus:outline-hidden ${
                        errors.email ? 'border-rose-500' : 'border-[#D9D6CE] focus:border-[#1E1E24]'
                      }`}
                    />
                    {errors.email && <p className="text-[10px] text-rose-600 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                      Mobile Telephone *
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 234-5678"
                      value={guest.phone}
                      onChange={(e) => {
                        setGuest({ ...guest, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      className={`w-full bg-white border p-2.5 text-xs text-[#1E1E24] focus:outline-hidden ${
                        errors.phone ? 'border-rose-500' : 'border-[#D9D6CE] focus:border-[#1E1E24]'
                      }`}
                    />
                    {errors.phone && <p className="text-[10px] text-rose-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Country & Arrival Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                      Country of Residence
                    </label>
                    <select
                      value={guest.country}
                      onChange={(e) => setGuest({ ...guest, country: e.target.value })}
                      className="w-full bg-white border border-[#D9D6CE] p-2.5 text-xs text-[#1E1E24] focus:outline-hidden focus:border-[#1E1E24]"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Germany">Germany</option>
                      <option value="Monaco">Monaco</option>
                      <option value="Japan">Japan</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                      Estimated Arrival Time
                    </label>
                    <select
                      value={guest.arrivalTime}
                      onChange={(e) => setGuest({ ...guest, arrivalTime: e.target.value })}
                      className="w-full bg-white border border-[#D9D6CE] p-2.5 text-xs text-[#1E1E24] focus:outline-hidden focus:border-[#1E1E24]"
                    >
                      <option value="15:00">Standard Check-In (3:00 PM)</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="18:00">6:00 PM (Late Afternoon)</option>
                      <option value="20:00">8:00 PM (Evening)</option>
                      <option value="22:00">10:00 PM or Later (Night)</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                    Special Inquiries & Dietary Preferences (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Feather-free down pillows requested, gluten-free dining notes, anniversary setup..."
                    value={guest.specialRequests}
                    onChange={(e) => setGuest({ ...guest, specialRequests: e.target.value })}
                    className="w-full bg-white border border-[#D9D6CE] p-2.5 text-xs text-[#1E1E24] focus:outline-hidden focus:border-[#1E1E24]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="w-full sm:w-auto bg-[#1E1E24] hover:bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-[0.16em] py-3 px-8 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Continue to Stay Enhancements</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sidebar Order Summary */}
              <div className="lg:col-span-5 bg-[#F4F1EB] p-5 sm:p-6 border border-[#E7E3D8] self-start">
                <div className="text-xs uppercase tracking-wider text-[#73737D] font-semibold mb-3">
                  Reservation Overview
                </div>
                <div className="flex gap-3 mb-4">
                  <img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-16 object-cover"
                  />
                  <div>
                    <h4 className="font-display text-base font-normal text-[#1E1E24] leading-tight">
                      {room.name}
                    </h4>
                    <p className="text-[11px] text-[#707079] mt-0.5">{room.view}</p>
                  </div>
                </div>

                <div className="border-t border-[#E5E1D5] py-3 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6D6D77]">Check-in</span>
                    <span className="font-medium text-[#1E1E24]">{getFormattedDate(searchCriteria.checkIn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6D6D77]">Check-out</span>
                    <span className="font-medium text-[#1E1E24]">{getFormattedDate(searchCriteria.checkOut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6D6D77]">Duration</span>
                    <span className="font-medium text-[#1E1E24]">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6D6D77]">Guests</span>
                    <span className="font-medium text-[#1E1E24]">
                      {searchCriteria.adults} Adults{searchCriteria.children > 0 ? `, ${searchCriteria.children} Children` : ''}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#E5E1D5] pt-3 text-xs space-y-1.5">
                  <div className="flex justify-between text-[#6D6D77]">
                    <span>Rate ({nights} nights)</span>
                    <span className="tabular-nums">{formatPrice(paymentSummary.subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-[#6D6D77]">
                    <span>Occupancy Tax (12%)</span>
                    <span className="tabular-nums">{formatPrice(paymentSummary.taxes, currency)}</span>
                  </div>
                  <div className="flex justify-between text-[#6D6D77]">
                    <span>Resort & Spa Fee</span>
                    <span className="tabular-nums">{formatPrice(paymentSummary.resortFee, currency)}</span>
                  </div>
                  <div className="flex justify-between font-display text-lg text-[#1E1E24] pt-2 border-t border-[#E5E1D5]">
                    <span>Total Due</span>
                    <span className="tabular-nums font-semibold">{formatPrice(paymentSummary.grandTotal, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BESPOKE ADD-ONS */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-normal text-[#1E1E24] mb-1">
                    Curate Your Stay Enhancements
                  </h2>
                  <p className="text-xs text-[#70707A] font-light">
                    Elevate your Aurelia experience with bespoke arrivals, dining, and wellness reservations.
                  </p>
                </div>

                <div className="space-y-3">
                  {ADD_ON_OPTIONS.map((addon) => {
                    const isSelected = selectedAddOnIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-4 border transition-all cursor-pointer flex items-start gap-4 ${
                          isSelected
                            ? 'bg-[#F2ECE1] border-[#C5A880] shadow-xs'
                            : 'bg-white border-[#E8E5DD] hover:border-[#C5A880]'
                        }`}
                      >
                        <div className="pt-0.5">
                          <div
                            className={`w-5 h-5 rounded-xs border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-[#1E1E24] border-[#1E1E24] text-white' : 'border-[#C7C4BC] bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-xs text-[#1E1E24] uppercase tracking-wide">
                              {addon.name}
                            </h4>
                            <span className="text-xs font-semibold text-[#1E1E24] tabular-nums">
                              +{formatPrice(addon.price, currency)}
                              <span className="text-[10px] text-[#70707A] font-normal lowercase ml-1">
                                {addon.billingType === 'per_stay'
                                  ? '/ stay'
                                  : addon.billingType === 'per_night'
                                  ? '/ night'
                                  : '/ guest per day'}
                              </span>
                            </span>
                          </div>
                          <p className="text-xs text-[#62626C] mt-0.5">{addon.tagline}</p>
                          <p className="text-[11px] text-[#80808A] font-light mt-1">{addon.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 border border-[#D9D6CE] text-xs font-semibold uppercase tracking-wider text-[#4A4A52] hover:bg-[#EFECE5] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 sm:flex-initial bg-[#1E1E24] hover:bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-[0.16em] py-3 px-8 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sidebar with Updated Addons Breakdown */}
              <div className="lg:col-span-5 bg-[#F4F1EB] p-5 sm:p-6 border border-[#E7E3D8] self-start">
                <div className="text-xs uppercase tracking-wider text-[#73737D] font-semibold mb-3">
                  Summary with Enhancements
                </div>

                <div className="text-xs space-y-2 pb-3 border-b border-[#E5E1D5]">
                  <div className="flex justify-between">
                    <span className="text-[#6D6D77]">Suite Base ({nights} nights)</span>
                    <span className="tabular-nums font-medium">{formatPrice(paymentSummary.subtotal, currency)}</span>
                  </div>

                  {selectedAddOns.length > 0 ? (
                    selectedAddOns.map((addon) => (
                      <div key={addon.id} className="flex justify-between text-[#44444C]">
                        <span className="truncate pr-2">+ {addon.name}</span>
                        <span className="tabular-nums shrink-0">
                          {formatPrice(
                            addon.billingType === 'per_stay'
                              ? addon.price
                              : addon.billingType === 'per_night'
                              ? addon.price * nights
                              : addon.price * searchCriteria.adults * nights,
                            currency
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-[#8A8A92] italic">No enhancements selected yet</div>
                  )}
                </div>

                <div className="pt-3 text-xs space-y-1.5">
                  <div className="flex justify-between text-[#6D6D77]">
                    <span>Occupancy Tax (12%)</span>
                    <span className="tabular-nums">{formatPrice(paymentSummary.taxes, currency)}</span>
                  </div>
                  <div className="flex justify-between text-[#6D6D77]">
                    <span>Resort & Wellness Fee</span>
                    <span className="tabular-nums">{formatPrice(paymentSummary.resortFee, currency)}</span>
                  </div>
                  <div className="flex justify-between font-display text-xl text-[#1E1E24] pt-2 border-t border-[#E5E1D5]">
                    <span>Total Due</span>
                    <span className="tabular-nums font-semibold">{formatPrice(paymentSummary.grandTotal, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SECURE PAYMENT PROCESSING */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-normal text-[#1E1E24] mb-1">
                    Secure Payment & Reservation Guarantee
                  </h2>
                  <p className="text-xs text-[#70707A] font-light">
                    All transactions are encrypted with 256-bit SSL certificate and processed via PCI-DSS compliant vault.
                  </p>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#EBE7DF] rounded-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-2 text-xs font-medium text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-white text-[#1E1E24] shadow-xs font-semibold'
                        : 'text-[#5E5E68] hover:text-[#1E1E24]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit / Debit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-2 px-2 text-xs font-medium text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-white text-[#1E1E24] shadow-xs font-semibold'
                        : 'text-[#5E5E68] hover:text-[#1E1E24]'
                    }`}
                  >
                    <span>Apple / Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('arrival_guarantee')}
                    className={`py-2 px-2 text-xs font-medium text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'arrival_guarantee'
                        ? 'bg-white text-[#1E1E24] shadow-xs font-semibold'
                        : 'text-[#5E5E68] hover:text-[#1E1E24]'
                    }`}
                  >
                    <span>Pay at Hotel</span>
                  </button>
                </div>

                {/* Option A: CREDIT / DEBIT CARD WITH LIVE 3D INTERACTIVE CARD */}
                {paymentMethod === 'card' && (
                  <div className="space-y-5">
                    {/* Live 3D Flipping Card Visual */}
                    <div className="perspective-1000 flex justify-center">
                      <div
                        className={`w-full max-w-sm h-48 rounded-xl p-5 text-white shadow-xl transition-transform duration-700 transform-style-3d relative cursor-pointer ${
                          isFlipped ? 'rotate-y-180' : ''
                        }`}
                        style={{
                          background:
                            'linear-gradient(135deg, #1E1E24 0%, #2B2B36 50%, #15151A 100%)',
                          border: '1px solid rgba(197, 168, 128, 0.4)',
                        }}
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        {/* FRONT OF CARD */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden">
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880]">
                              Aurelia Reserve Card
                            </div>
                            <div className="text-xs uppercase font-bold tracking-widest text-[#E0CEB5]">
                              {cardType === 'visa' && 'VISA'}
                              {cardType === 'mastercard' && 'MASTERCARD'}
                              {cardType === 'amex' && 'AMEX'}
                              {cardType === 'discover' && 'DISCOVER'}
                              {cardType === 'generic' && 'PAYMENT'}
                            </div>
                          </div>

                          {/* Metallic Chip */}
                          <div className="w-10 h-7 rounded-sm bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] opacity-80 shadow-xs flex items-center justify-center">
                            <div className="w-7 h-4 border border-[#B38F24]/50 rounded-xs" />
                          </div>

                          {/* Card Number */}
                          <div className="font-mono text-base sm:text-lg tracking-[0.2em] tabular-nums text-white">
                            {cardData.cardNumber || '•••• •••• •••• ••••'}
                          </div>

                          {/* Cardholder & Expiry */}
                          <div className="flex items-end justify-between text-xs">
                            <div>
                              <div className="text-[8px] uppercase tracking-wider text-white/50">
                                Cardholder Name
                              </div>
                              <div className="font-medium tracking-wide truncate max-w-[170px] uppercase">
                                {cardData.cardHolder || `${guest.firstName || 'GUEST'} ${guest.lastName || 'NAME'}`}
                              </div>
                            </div>
                            <div>
                              <div className="text-[8px] uppercase tracking-wider text-white/50">
                                Expires
                              </div>
                              <div className="font-mono tracking-wider tabular-nums">
                                {cardData.expiryDate || 'MM/YY'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* BACK OF CARD */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden rotate-y-180">
                          <div className="w-full h-8 bg-black/70 -mx-5 mt-2" />
                          <div className="space-y-1">
                            <div className="text-[8px] uppercase tracking-wider text-white/50 text-right">
                              Security Code (CVV)
                            </div>
                            <div className="w-full bg-white text-[#1E1E24] text-right font-mono px-3 py-1 text-sm font-semibold tracking-widest">
                              {cardData.cvv || '•••'}
                            </div>
                          </div>
                          <div className="text-[9px] text-white/40 text-center font-light">
                            Click card to flip back · Encrypted 256-Bit SSL Gateway
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Input Form */}
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                          Card Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            placeholder="4000 1234 5678 9010"
                            value={cardData.cardNumber}
                            onFocus={() => setIsFlipped(false)}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value);
                              setCardData({ ...cardData, cardNumber: formatted });
                              if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
                            }}
                            className={`w-full bg-white border p-2.5 text-xs text-[#1E1E24] font-mono focus:outline-hidden ${
                              errors.cardNumber ? 'border-rose-500' : 'border-[#D9D6CE] focus:border-[#1E1E24]'
                            }`}
                          />
                          <div className="absolute right-3 top-2.5 text-[10px] font-semibold uppercase text-[#82828A]">
                            {cardType.toUpperCase()}
                          </div>
                        </div>
                        {errors.cardNumber && <p className="text-[10px] text-rose-600 mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                          Cardholder Name (as printed on card) *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ALEXANDER VANCE"
                          value={cardData.cardHolder}
                          onFocus={() => setIsFlipped(false)}
                          onChange={(e) => {
                            setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() });
                            if (errors.cardHolder) setErrors({ ...errors, cardHolder: '' });
                          }}
                          className={`w-full bg-white border p-2.5 text-xs text-[#1E1E24] focus:outline-hidden uppercase ${
                            errors.cardHolder ? 'border-rose-500' : 'border-[#D9D6CE] focus:border-[#1E1E24]'
                          }`}
                        />
                        {errors.cardHolder && <p className="text-[10px] text-rose-600 mt-1">{errors.cardHolder}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                            Expiration Date (MM/YY) *
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="08/28"
                            value={cardData.expiryDate}
                            onFocus={() => setIsFlipped(false)}
                            onChange={(e) => {
                              const formatted = formatExpiryDate(e.target.value);
                              setCardData({ ...cardData, expiryDate: formatted });
                              if (errors.expiryDate) setErrors({ ...errors, expiryDate: '' });
                            }}
                            className={`w-full bg-white border p-2.5 text-xs text-[#1E1E24] font-mono focus:outline-hidden ${
                              errors.expiryDate ? 'border-rose-500' : 'border-[#D9D6CE] focus:border-[#1E1E24]'
                            }`}
                          />
                          {errors.expiryDate && <p className="text-[10px] text-rose-600 mt-1">{errors.expiryDate}</p>}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                            CVV / CVC (3-4 digits) *
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="•••"
                            value={cardData.cvv}
                            onFocus={() => setIsFlipped(true)}
                            onBlur={() => setIsFlipped(false)}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/[^0-9]/g, '');
                              setCardData({ ...cardData, cvv: clean });
                              if (errors.cvv) setErrors({ ...errors, cvv: '' });
                            }}
                            className={`w-full bg-white border p-2.5 text-xs text-[#1E1E24] font-mono focus:outline-hidden ${
                              errors.cvv ? 'border-rose-500' : 'border-[#D9D6CE] focus:border-[#1E1E24]'
                            }`}
                          />
                          {errors.cvv && <p className="text-[10px] text-rose-600 mt-1">{errors.cvv}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1">
                          Billing Postal / Zip Code *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 90210 or 75008"
                          value={cardData.billingZip}
                          onFocus={() => setIsFlipped(false)}
                          onChange={(e) => {
                            setCardData({ ...cardData, billingZip: e.target.value });
                            if (errors.billingZip) setErrors({ ...errors, billingZip: '' });
                          }}
                          className={`w-full bg-white border p-2.5 text-xs text-[#1E1E24] focus:outline-hidden ${
                            errors.billingZip ? 'border-rose-500' : 'border-[#D9D6CE] focus:border-[#1E1E24]'
                          }`}
                        />
                        {errors.billingZip && <p className="text-[10px] text-rose-600 mt-1">{errors.billingZip}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Option B: DIGITAL WALLET (APPLE / GOOGLE PAY) */}
                {paymentMethod === 'apple_pay' && (
                  <div className="bg-white p-6 border border-[#E8E5DD] text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-md">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-[#1E1E24]">One-Touch Express Biometric Pay</h4>
                      <p className="text-xs text-[#6B6B75] mt-1 max-w-sm mx-auto">
                        Authorize payment instantly using Touch ID, Face ID, or your verified digital device wallet.
                      </p>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#52525C] flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                      <span>Device tokenization hides your actual card number from merchants.</span>
                    </div>
                  </div>
                )}

                {/* Option C: PAY ON ARRIVAL GUARANTEE */}
                {paymentMethod === 'arrival_guarantee' && (
                  <div className="bg-white p-6 border border-[#E8E5DD] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E1E24]">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                      <span>Pay at Hotel Check-In with Reservation Hold</span>
                    </div>
                    <p className="text-xs text-[#63636C] leading-relaxed">
                      Your suite will be guaranteed for late arrival until 11:59 PM. No immediate charge will be debited today. You can settle the full balance via cash, credit card, or bank wire during your stay at the front desk.
                    </p>
                    <div className="text-[11px] text-[#80808A] bg-[#FAF8F5] p-3 border border-[#EBE7DF]">
                      Notice: Aurelia Grand reserves the right to pre-authorize your registered card 48 hours prior to arrival in accordance with standard hotel policies.
                    </div>
                  </div>
                )}

                {/* Security Trust Seals */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E5DD] text-[11px] text-[#7A7A84]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                    <span>PCI-DSS Level 1 Certified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#C5A880]" />
                    <span>256-bit TLS Encryption</span>
                  </div>
                  <div>Visa Secure · Mastercard ID Check</div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-3 border border-[#D9D6CE] text-xs font-semibold uppercase tracking-wider text-[#4A4A52] hover:bg-[#EFECE5] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleProcessPayment}
                    className="flex-1 bg-[#1E1E24] hover:bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-[0.16em] py-3.5 px-8 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Authorizing Transaction...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          {paymentMethod === 'arrival_guarantee'
                            ? 'Confirm & Hold Reservation'
                            : `Pay & Confirm ${formatPrice(paymentSummary.grandTotal, currency)}`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sidebar Order Summary with Promo Code Field */}
              <div className="lg:col-span-5 bg-[#F4F1EB] p-5 sm:p-6 border border-[#E7E3D8] self-start space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#73737D] font-semibold mb-2">
                    Payment Breakdown
                  </div>
                  <div className="text-sm font-medium text-[#1E1E24]">{room.name}</div>
                  <div className="text-xs text-[#70707A]">
                    {getFormattedDate(searchCriteria.checkIn)} — {getFormattedDate(searchCriteria.checkOut)} ({nights} nights)
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="pt-2 border-t border-[#E5E1D5]">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#63636C] mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#C5A880]" />
                    <span>Promotional Code</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-[#D9D6CE] p-2 text-xs font-mono uppercase focus:outline-hidden focus:border-[#1E1E24]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-[#1E1E24] hover:bg-[#C5A880] text-white text-xs font-semibold px-3 py-2 uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[10px] text-rose-600 mt-1">{promoError}</p>}
                  {appliedPromo && (
                    <div className="mt-1.5 p-2 bg-[#EAE5D9] text-[#1E1E24] text-xs flex items-center justify-between">
                      <span className="font-medium text-[11px]">{appliedPromo.label} applied</span>
                      <button
                        type="button"
                        onClick={() => setAppliedPromo(null)}
                        className="text-xs text-rose-700 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Detailed Line Items */}
                <div className="border-t border-[#E5E1D5] pt-3 text-xs space-y-2">
                  <div className="flex justify-between text-[#6D6D77]">
                    <span>Suite Rate ({nights} nights × {formatPrice(room.pricePerNight, currency)})</span>
                    <span className="tabular-nums font-medium text-[#1E1E24]">{formatPrice(paymentSummary.subtotal, currency)}</span>
                  </div>

                  {selectedAddOns.map((addon) => (
                    <div key={addon.id} className="flex justify-between text-[#6D6D77]">
                      <span className="truncate pr-2">+ {addon.name}</span>
                      <span className="tabular-nums font-medium text-[#1E1E24]">
                        {formatPrice(
                          addon.billingType === 'per_stay'
                            ? addon.price
                            : addon.billingType === 'per_night'
                            ? addon.price * nights
                            : addon.price * searchCriteria.adults * nights,
                          currency
                        )}
                      </span>
                    </div>
                  ))}

                  {paymentSummary.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span className="tabular-nums">-{formatPrice(paymentSummary.discountAmount, currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#6D6D77]">
                    <span>Occupancy & Hospitality Tax (12%)</span>
                    <span className="tabular-nums">{formatPrice(paymentSummary.taxes, currency)}</span>
                  </div>

                  <div className="flex justify-between text-[#6D6D77]">
                    <span>Resort Facility Fee ($35/night)</span>
                    <span className="tabular-nums">{formatPrice(paymentSummary.resortFee, currency)}</span>
                  </div>

                  <div className="border-t border-[#E5E1D5] pt-3 flex justify-between font-display text-2xl text-[#1E1E24]">
                    <span>Grand Total</span>
                    <span className="tabular-nums font-semibold">{formatPrice(paymentSummary.grandTotal, currency)}</span>
                  </div>
                </div>

                {/* Cancellation Policy Banner */}
                <div className="text-[11px] text-[#7A7A84] border-t border-[#E5E1D5] pt-3 leading-relaxed">
                  ✓ Free cancellation with full refund until 48 hours before check-in.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: INSTANT CONFIRMATION & DIGITAL VOUCHER */}
          {step === 4 && confirmedReservation && (
            <div className="max-w-2xl mx-auto text-center space-y-6 animate-fadeIn py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-1">
                  Reservation Confirmed & Guaranteed
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#1E1E24]">
                  We Look Forward to Welcoming You
                </h2>
                <p className="text-xs sm:text-sm text-[#6A6A74] mt-1 max-w-md mx-auto">
                  A receipt and your digital check-in voucher have been sent to{' '}
                  <strong className="text-[#1E1E24]">{confirmedReservation.guest.email}</strong>.
                </p>
              </div>

              {/* Printable Guest Voucher Card */}
              <div className="bg-white border border-[#E7E4DC] p-6 text-left shadow-lg relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#EFECE5] gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#8A8A94]">Booking Reference</div>
                    <div className="font-mono text-2xl font-bold tracking-widest text-[#1E1E24]">
                      {confirmedReservation.confirmationCode}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-14 h-14 bg-[#1E1E24] text-white p-1 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-[10px] text-[#7E7E88] max-w-[100px] leading-tight">
                      Scan at Front Desk for Express Digital Key
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#EFECE5] text-xs">
                  <div>
                    <span className="block text-[10px] uppercase text-[#888892]">Guest</span>
                    <span className="font-medium text-[#1E1E24]">
                      {confirmedReservation.guest.title} {confirmedReservation.guest.firstName} {confirmedReservation.guest.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-[#888892]">Dates</span>
                    <span className="font-medium text-[#1E1E24]">
                      {getFormattedDate(confirmedReservation.searchCriteria.checkIn)} - {getFormattedDate(confirmedReservation.searchCriteria.checkOut)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-[#888892]">Accommodation</span>
                    <span className="font-medium text-[#1E1E24] truncate block">
                      {confirmedReservation.room.name}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-[#888892]">Total Paid</span>
                    <span className="font-medium text-[#1E1E24] tabular-nums">
                      {formatPrice(confirmedReservation.paymentSummary.grandTotal, currency)}
                    </span>
                  </div>
                </div>

                {confirmedReservation.addOns.length > 0 && (
                  <div className="py-3 border-b border-[#EFECE5] text-xs">
                    <span className="text-[10px] uppercase text-[#888892] block mb-1">Included Stay Enhancements</span>
                    <div className="flex flex-wrap gap-2 text-[#4A4A52]">
                      {confirmedReservation.addOns.map((a) => (
                        <span key={a.id} className="text-xs">
                          • {a.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 text-[11px] text-[#7E7E88] flex items-center justify-between">
                  <span>Hotel Address: 14 Boulevard de la Croisette, Cap d'Antibes</span>
                  <span className="text-emerald-700 font-semibold">Payment Status: {confirmedReservation.paymentStatus === 'paid' ? 'Paid in Full' : 'Guaranteed'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 border border-[#D9D6CE] bg-white text-xs font-semibold uppercase tracking-wider text-[#1E1E24] hover:bg-[#F2ECE3] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#1E1E24] hover:bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-[0.16em] py-2.5 px-6 transition-colors cursor-pointer shadow-md"
                >
                  Return to Resort
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
