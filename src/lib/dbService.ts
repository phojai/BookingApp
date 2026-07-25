import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Room, Booking, GuestProfile, Property } from '../types';
import { INITIAL_ROOMS, INITIAL_BOOKINGS, INITIAL_GUESTS, INITIAL_PROPERTIES } from '../data/initialData';

export interface AppData {
  rooms: Room[];
  bookings: Booking[];
  guests: GuestProfile[];
  properties: Property[];
}

// Ensure clean numeric values and remove undefined fields for Firestore compatibility
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      clean[key] = val;
    }
  }
  return clean as T;
}

/**
 * Load initial data from Firestore database.
 * If Firestore is empty (e.g., first setup), seeds initial default records into Firestore.
 */
export async function loadAppDataFromFirestore(): Promise<AppData> {
  try {
    const propsSnap = await getDocs(collection(db, 'properties')).catch(err => {
      handleFirestoreError(err, OperationType.LIST, 'properties');
      return null;
    });

    const roomsSnap = await getDocs(collection(db, 'rooms')).catch(err => {
      handleFirestoreError(err, OperationType.LIST, 'rooms');
      return null;
    });

    const bookingsSnap = await getDocs(collection(db, 'bookings')).catch(err => {
      handleFirestoreError(err, OperationType.LIST, 'bookings');
      return null;
    });

    const guestsSnap = await getDocs(collection(db, 'guests')).catch(err => {
      handleFirestoreError(err, OperationType.LIST, 'guests');
      return null;
    });

    let loadedProperties: Property[] = [];
    let loadedRooms: Room[] = [];
    let loadedBookings: Booking[] = [];
    let loadedGuests: GuestProfile[] = [];

    if (propsSnap && !propsSnap.empty) {
      loadedProperties = propsSnap.docs.map(d => d.data() as Property);
    }

    if (roomsSnap && !roomsSnap.empty) {
      loadedRooms = roomsSnap.docs.map(d => d.data() as Room);
    }

    if (bookingsSnap && !bookingsSnap.empty) {
      loadedBookings = bookingsSnap.docs.map(d => d.data() as Booking);
    }

    if (guestsSnap && !guestsSnap.empty) {
      loadedGuests = guestsSnap.docs.map(d => d.data() as GuestProfile);
    }

    // If properties collection is empty, seed with INITIAL_PROPERTIES
    if (loadedProperties.length === 0) {
      console.log('Seeding initial properties to Firestore...');
      loadedProperties = INITIAL_PROPERTIES;
      await seedPropertiesToFirestore(INITIAL_PROPERTIES);
    }

    // If Firestore is completely empty for rooms, seed with INITIAL_ROOMS
    if (loadedRooms.length === 0) {
      console.log('Seeding initial room inventory to Firestore...');
      loadedRooms = INITIAL_ROOMS;
      await seedRoomsToFirestore(INITIAL_ROOMS);
    }

    // If Firestore is completely empty for bookings, seed with INITIAL_BOOKINGS
    if (loadedBookings.length === 0 && loadedGuests.length === 0) {
      const hasSeededBefore = localStorage.getItem('homestay_firestore_seeded');
      if (!hasSeededBefore) {
        console.log('Seeding initial bookings and guests to Firestore...');
        loadedBookings = INITIAL_BOOKINGS;
        loadedGuests = INITIAL_GUESTS;
        await seedBookingsAndGuestsToFirestore(INITIAL_BOOKINGS, INITIAL_GUESTS);
        localStorage.setItem('homestay_firestore_seeded', 'true');
      }
    }

    // Apply default propertyId to existing rooms/bookings if missing
    loadedRooms = loadedRooms.map(r => ({
      ...r,
      propertyId: r.propertyId || 'p-nohshring'
    }));

    loadedBookings = loadedBookings.map(b => ({
      ...b,
      propertyId: b.propertyId || 'p-nohshring'
    }));

    // Apply rule: Rooms 2.1 and 3.1 default price fix if needed
    loadedRooms = loadedRooms.map(r => {
      if (r.roomNumber === '2.1' || r.roomNumber === '3.1' || r.name.includes('2.1') || r.name.includes('3.1')) {
        if (!r.pricePerNight || r.pricePerNight < 2500) {
          return { ...r, pricePerNight: 2500 };
        }
      }
      return r;
    });

    return {
      properties: loadedProperties,
      rooms: loadedRooms,
      bookings: loadedBookings,
      guests: loadedGuests
    };
  } catch (err) {
    console.warn('Firestore load failed, falling back to local storage:', err);
    throw err;
  }
}

/**
 * Seed initial properties to Firestore
 */
async function seedPropertiesToFirestore(properties: Property[]) {
  try {
    const batch = writeBatch(db);
    properties.forEach(p => {
      const ref = doc(db, 'properties', p.id);
      batch.set(ref, sanitizeForFirestore(p));
    });
    await batch.commit();
  } catch (e) {
    console.error('Failed to seed properties to Firestore:', e);
  }
}

/**
 * Seed initial room inventory into Firestore
 */
async function seedRoomsToFirestore(rooms: Room[]) {
  try {
    const batch = writeBatch(db);
    rooms.forEach(r => {
      const ref = doc(db, 'rooms', r.id);
      batch.set(ref, sanitizeForFirestore(r));
    });
    await batch.commit();
  } catch (e) {
    console.error('Failed to seed rooms to Firestore:', e);
  }
}

/**
 * Seed initial bookings and guests into Firestore
 */
async function seedBookingsAndGuestsToFirestore(bookings: Booking[], guests: GuestProfile[]) {
  try {
    const batch = writeBatch(db);
    bookings.forEach(b => {
      const ref = doc(db, 'bookings', b.id);
      batch.set(ref, sanitizeForFirestore(b));
    });
    guests.forEach(g => {
      const ref = doc(db, 'guests', g.id);
      batch.set(ref, sanitizeForFirestore(g));
    });
    await batch.commit();
  } catch (e) {
    console.error('Failed to seed bookings & guests to Firestore:', e);
  }
}

/**
 * Save single room to Firestore
 */
export async function saveRoomToFirestore(room: Room): Promise<void> {
  try {
    await setDoc(doc(db, 'rooms', room.id), sanitizeForFirestore(room));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `rooms/${room.id}`);
  }
}

/**
 * Save single booking to Firestore
 */
export async function saveBookingToFirestore(booking: Booking): Promise<void> {
  try {
    await setDoc(doc(db, 'bookings', booking.id), sanitizeForFirestore(booking));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `bookings/${booking.id}`);
  }
}

/**
 * Save single guest profile to Firestore
 */
export async function saveGuestToFirestore(guest: GuestProfile): Promise<void> {
  try {
    await setDoc(doc(db, 'guests', guest.id), sanitizeForFirestore(guest));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `guests/${guest.id}`);
  }
}

/**
 * Delete a booking from Firestore
 */
export async function deleteBookingFromFirestore(bookingId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'bookings', bookingId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `bookings/${bookingId}`);
  }
}

/**
 * Clear all bookings and guests from Firestore
 */
export async function clearAllBookingsFromFirestore(): Promise<void> {
  try {
    const bookingsSnap = await getDocs(collection(db, 'bookings'));
    const guestsSnap = await getDocs(collection(db, 'guests'));

    const batch = writeBatch(db);
    bookingsSnap.docs.forEach(d => batch.delete(d.ref));
    guestsSnap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    console.error('Failed to clear bookings in Firestore:', err);
  }
}

/**
 * Sync entire state to Firestore (and local server / localStorage)
 */
export async function syncAllToFirestore(rooms: Room[], bookings: Booking[], guests: GuestProfile[], properties?: Property[]): Promise<void> {
  try {
    // Write batch for modified or new records
    const batch = writeBatch(db);
    if (properties && properties.length > 0) {
      properties.forEach(p => batch.set(doc(db, 'properties', p.id), sanitizeForFirestore(p)));
    }
    rooms.forEach(r => batch.set(doc(db, 'rooms', r.id), sanitizeForFirestore(r)));
    bookings.forEach(b => batch.set(doc(db, 'bookings', b.id), sanitizeForFirestore(b)));
    guests.forEach(g => batch.set(doc(db, 'guests', g.id), sanitizeForFirestore(g)));
    await batch.commit();
  } catch (err) {
    console.warn('Failed batch sync to Firestore:', err);
  }
}
