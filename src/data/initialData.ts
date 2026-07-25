import { Room, Booking, GuestProfile, Property } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'p-nohshring',
    name: 'Nohshring Homestay',
    tagline: 'Serene Mountain & Lake Retreat in Umrangso',
    address: 'Near Karbi Club, Umrangso, Dima Hasao',
    city: 'Umrangso',
    state: 'Assam',
    pincode: '788819',
    phone: '+91 7086015740',
    email: 'stay@nohshring.com',
    gstin: '18AABCN1234F1Z5',
    isDefault: true,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'p-pineview',
    name: 'Pine View Resort & Stay',
    tagline: 'Luxury Eco-Stay near Umrangso Golf Course',
    address: 'Golf Course Road, Umrangso, Dima Hasao',
    city: 'Umrangso',
    state: 'Assam',
    pincode: '788819',
    phone: '+91 9876543210',
    email: 'pineview@homestay.com',
    gstin: '18XYZ12345P1Z9',
    isDefault: false,
    createdAt: '2026-01-02T00:00:00Z'
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-1',
    propertyId: 'p-nohshring',
    roomNumber: '1',
    name: 'Room 1 Ac Luxury',
    type: 'Deluxe Suite',
    capacity: 2,
    pricePerNight: 4500,
    amenities: ['Air Conditioning', 'Luxury Bath', 'King Bed', 'Free WiFi', 'Hot Shower', 'Breakfast Included'],
    status: 'active',
    notes: 'Premium AC luxury room with high-end fixtures and mountain view.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'room-2',
    propertyId: 'p-nohshring',
    roomNumber: '2',
    name: 'Room 2 Balcony',
    type: 'Cottage',
    capacity: 3,
    pricePerNight: 2500,
    amenities: ['Private Balcony', 'Panoramic View', 'Queen Bed', 'Free WiFi', 'Tea Maker', 'Balcony Sit-Out'],
    status: 'active',
    notes: 'Spacious cottage room featuring a private balcony, bedroom, and balcony sit-out dining area.',
    imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: '2026-01-12T11:00:00Z',
  },
  {
    id: 'room-2-1',
    propertyId: 'p-nohshring',
    roomNumber: '2.1',
    name: 'Room 2.1 No Balcony',
    type: 'Standard Room',
    capacity: 2,
    pricePerNight: 2500,
    amenities: ['Garden View', 'Queen Bed', 'Free WiFi', 'Hot Shower'],
    status: 'active',
    notes: 'Cozy room without balcony overlooking the serene inner garden.',
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'room-3',
    propertyId: 'p-nohshring',
    roomNumber: '3',
    name: 'Room 3 Balcony',
    type: 'Garden Villa',
    capacity: 4,
    pricePerNight: 2500,
    amenities: ['Private Balcony', 'Valley View', 'King + Sofa Bed', 'Free WiFi', 'Breakfast Included'],
    status: 'active',
    notes: 'Villa suite with large private balcony facing sunrise valley.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-01T14:00:00Z',
  },
  {
    id: 'room-3-1',
    propertyId: 'p-nohshring',
    roomNumber: '3.1',
    name: 'Room 3.1 No Balcony',
    type: 'Standard Room',
    capacity: 2,
    pricePerNight: 2500,
    amenities: ['Valley View', 'Queen Bed', 'Free WiFi', 'Hot Water Shower'],
    status: 'active',
    notes: 'Comfortable standard room without balcony.',
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'room-pine-1',
    propertyId: 'p-pineview',
    roomNumber: 'PV-101',
    name: 'Pine Villa Suite 101',
    type: 'Luxury Room',
    capacity: 3,
    pricePerNight: 3500,
    amenities: ['Golf Course View', 'Air Conditioning', 'King Bed', 'Free WiFi', 'Mini Bar'],
    status: 'active',
    notes: 'Luxury Villa overlooking the pine valley and golf course.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-15T10:00:00Z',
  }
];

export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_GUESTS: GuestProfile[] = [];
