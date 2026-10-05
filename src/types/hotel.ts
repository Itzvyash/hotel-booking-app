export type RoomCategory = 'all' | 'villa' | 'penthouse' | 'suite' | 'garden';

export interface Room {
  id: string;
  name: string;
  subtitle: string;
  category: 'villa' | 'penthouse' | 'suite' | 'garden';
  pricePerNight: number;
  originalPricePerNight?: number;
  capacity: {
    adults: number;
    children: number;
    maxGuests: number;
  };
  sizeSqm: number;
  sizeSqft: number;
  bedType: '1 King Bed' | '1 King Bed or 2 Queens' | '2 King Beds' | '1 Super King';
  view: 'Panoramic Ocean' | 'Skyline & Bay' | 'Private Zen Garden' | 'Horizon Coastline' | 'Waterfall Courtyard';
  floorLevel: string;
  image: string;
  additionalImages?: string[];
  description: string;
  highlights: string[];
  amenities: string[];
  inclusions: string[];
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
}

export interface BookingSearchCriteria {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  category: RoomCategory;
  priceRange: [number, number];
  bedType: string;
  view: string;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'size';
}

export interface AddOnOption {
  id: string;
  name: string;
  tagline: string;
  price: number;
  billingType: 'per_stay' | 'per_night' | 'per_guest';
  description: string;
  iconName: 'car' | 'sparkles' | 'coffee' | 'heart' | 'ship';
}

export interface GuestDetails {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests: string;
  arrivalTime: string;
  flightNumber?: string;
  isCelebratingOccasion?: boolean;
  occasionDetails?: string;
}

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'arrival_guarantee';

export interface CardPaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  billingZip: string;
  saveCardForFuture: boolean;
}

export interface PaymentSummary {
  nights: number;
  basePricePerNight: number;
  subtotal: number;
  addOnsTotal: number;
  taxes: number; // e.g. 12%
  resortFee: number; // e.g. $35/night
  discountAmount: number;
  discountCode?: string;
  grandTotal: number;
}

export interface Reservation {
  id: string;
  confirmationCode: string;
  room: Room;
  searchCriteria: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
  };
  guest: GuestDetails;
  addOns: AddOnOption[];
  paymentMethod: PaymentMethod;
  paymentSummary: PaymentSummary;
  paymentStatus: 'paid' | 'guaranteed_arrival';
  cardLastFour?: string;
  cardBrand?: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}
