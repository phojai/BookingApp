import React, { useState } from 'react';
import { GuestProfile, Booking } from '../../types';
import { formatCurrency, formatDateReadable } from '../../utils/bookingUtils';
import {
  Users,
  Search,
  Star,
  Phone,
  Mail,
  MessageSquare,
  History,
  Edit,
  Plus
} from 'lucide-react';

interface GuestCRMProps {
  guests: GuestProfile[];
  bookings: Booking[];
  onUpdateGuest: (guest: GuestProfile) => void;
}

export const GuestCRM: React.FC<GuestCRMProps> = ({ guests = [], bookings = [], onUpdateGuest }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingGuest, setEditingGuest] = useState<GuestProfile | null>(null);

  const [preferences, setPreferences] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isVIP, setIsVIP] = useState<boolean>(false);

  const openEditModal = (guest: GuestProfile) => {
    setEditingGuest(guest);
    setPreferences(guest.preferences || '');
    setNotes(guest.notes || '');
    setIsVIP(guest.isVIP);
  };

  const handleSaveGuest = () => {
    if (!editingGuest) return;
    const updated: GuestProfile = {
      ...editingGuest,
      preferences,
      notes,
      isVIP
    };
    onUpdateGuest(updated);
    setEditingGuest(null);
  };

  const filteredGuests = guests.filter(g => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return g.name.toLowerCase().includes(q) || g.mobile.includes(q) || g.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Guest CRM & Relationship Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Stay histories, VIP tags, preferences, and direct WhatsApp messaging
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guest name, phone, or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Guest Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuests.map(guest => {
          const guestBookings = bookings.filter(
            b => b.guestMobile === guest.mobile || b.guestName.toLowerCase() === guest.name.toLowerCase()
          );

          const whatsappUrl = `https://wa.me/${guest.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${guest.name}, greetings from Noahsring Homestay! We look forward to welcoming you.`)}`;

          return (
            <div key={guest.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-800">{guest.name}</h3>
                      {guest.isVIP && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> VIP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {guest.mobile}
                    </p>
                  </div>

                  <button
                    onClick={() => openEditModal(guest)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Edit Notes & VIP Status"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Stays</span>
                    <p className="text-sm font-extrabold text-slate-800">{guest.totalStays}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Nights</span>
                    <p className="text-sm font-extrabold text-slate-800">{guest.totalNights}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Spend</span>
                    <p className="text-xs font-extrabold text-emerald-700">{formatCurrency(guest.totalSpend)}</p>
                  </div>
                </div>

                {/* Preferences & Notes */}
                {(guest.preferences || guest.notes) && (
                  <div className="mt-3 text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 space-y-1">
                    {guest.preferences && (
                      <p><strong>Preferences:</strong> {guest.preferences}</p>
                    )}
                    {guest.notes && (
                      <p className="text-slate-500"><strong>Notes:</strong> {guest.notes}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <span className="text-[10px] text-slate-400">
                  Last stay: {formatDateReadable(guest.lastStayDate)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: EDIT GUEST */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-800">Edit Guest Profile: {editingGuest.name}</h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVIP}
                  onChange={e => setIsVIP(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                />
                <span>Mark Guest as VIP / Repeat Special Visitor</span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guest Preferences</label>
                <textarea
                  rows={2}
                  value={preferences}
                  onChange={e => setPreferences(e.target.value)}
                  placeholder="e.g. High floor, ground floor, extra pillows..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Internal notes for staff..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setEditingGuest(null)}
                className="px-4 py-2 text-xs bg-slate-100 text-slate-700 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGuest}
                className="px-5 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
