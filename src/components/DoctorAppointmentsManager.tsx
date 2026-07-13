"use client";

import React, { useState } from 'react';
import { 
  Calendar, Search, Trash2, X, Clock, Mail, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DoctorAppointmentRecord } from '../types';

interface DoctorAppointmentsManagerProps {
  appointments: DoctorAppointmentRecord[];
  onStatusChange: (id: string, status: DoctorAppointmentRecord['status']) => void;
  onNoteSave: (id: string, noteText: string) => void;
  onDelete: (id: string) => void;
}

export default function DoctorAppointmentsManager({
  appointments,
  onStatusChange,
  onNoteSave,
  onDelete
}: DoctorAppointmentsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointmentRecord | null>(null);
  const [internalNoteText, setInternalNoteText] = useState('');

  // Helper parser for prices
  const parsePrice = (priceStr: string) => {
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Status coloring utility
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'reserved':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((a) => {
    const name = (a.name || '').toLowerCase();
    const phone = (a.phone || '').toLowerCase();
    const ref = (a.bookingRef || '').toLowerCase();
    const service = a.service ? a.service.toLowerCase() : '';
    const services = a.services ? a.services.map(s => s.name.toLowerCase()).join(' ') : '';
    
    const matchesSearch = 
      name.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase()) ||
      ref.includes(searchTerm.toLowerCase()) ||
      service.includes(searchTerm.toLowerCase()) ||
      services.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filter and Search Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by patient, ref, phone or clinical procedure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#003334] focus:ring-1 focus:ring-[#003334] transition-colors"
          />
        </div>

        {/* Status Tabs/Select */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'reserved', label: 'Reserved' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === item.id
                  ? 'bg-silver-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-150'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Results */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-silver-900">Dr. Faith Nzurike Appointment Diary</h3>
            <p className="text-xs text-slate-500">Manage direct clinical time slots reserved at Devonshire Place or Harley Street consulting chambers</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono font-bold">
            Showing {filteredAppointments.length} diaries
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Calendar className="h-12 w-12 mx-auto opacity-40" />
            <p className="font-medium text-sm">No matching doctor diaries found.</p>
            <p className="text-xs">Adjust filters or search parameters and try again.</p>
          </div>
        ) : (
          <>
            {/* Desktop and Tablet Landscape: Table view */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold font-sans">
                    <th className="py-3.5 px-6">Clinical Ref / Patient</th>
                    <th className="py-3.5 px-6">Desired Slot</th>
                    <th className="py-3.5 px-6">Specialty Procedure</th>
                    <th className="py-3.5 px-6">Value</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredAppointments.map((a) => {
                    const totalWorth = a.services ? a.services.reduce((sum, s) => sum + parsePrice(s.price), 0) : 0;
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="inline-block font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] mb-1">
                            {a.bookingRef}
                          </span>
                          <div className="font-sans font-bold text-slate-800 text-sm">{a.name}</div>
                          <div className="text-slate-400 text-[11px] font-mono">{a.phone}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold">{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                          <div className="text-[11px] text-[#c5a880] font-sans font-semibold tracking-wide uppercase">{a.time}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            {a.services && a.services.map(s => (
                              <span key={s.id} className="inline-block bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border border-slate-200 mr-1">
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-serif font-bold text-slate-800 text-sm">
                          £{totalWorth.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusBadgeClass(a.status)}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedAppointment(a);
                              setInternalNoteText(a.internalNotes || '');
                            }}
                            className="bg-silver-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            View / Note
                          </button>
                          <button
                            onClick={() => onDelete(a.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all border border-transparent hover:border-rose-100 cursor-pointer inline-flex items-center justify-center align-middle"
                            title="Delete appointment record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile and Tablet Portrait: Card view */}
            <div className="lg:hidden divide-y divide-slate-100">
              {filteredAppointments.map((a) => {
                const totalWorth = a.services ? a.services.reduce((sum, s) => sum + parsePrice(s.price), 0) : 0;
                return (
                  <div key={a.id} className="p-5 space-y-4 hover:bg-slate-50/30 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="inline-block font-mono font-bold bg-slate-200 text-slate-750 px-2 py-0.5 rounded text-[10px] mb-1">
                          {a.bookingRef}
                        </span>
                        <div className="font-sans font-bold text-slate-800 text-sm">{a.name}</div>
                        <div className="text-slate-400 text-[11px] font-mono mt-0.5">{a.phone}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider ${getStatusBadgeClass(a.status)}`}>
                        {a.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs border-t border-b border-slate-100 py-3 bg-slate-50/50 p-3 rounded-xl">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Desired Slot</span>
                        <div className="font-semibold text-slate-700 mt-0.5">{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[10px] text-[#c5a880] uppercase tracking-wide font-bold mt-0.5">{a.time}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Procedure Value</span>
                        <div className="font-serif font-black text-slate-850 text-base mt-0.5">£{totalWorth.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Specialty Procedures</span>
                      <div className="flex flex-wrap gap-1">
                        {a.services && a.services.map(s => (
                          <span key={s.id} className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[10px] font-bold border border-slate-200">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100/50">
                      <button
                        onClick={() => {
                          setSelectedAppointment(a);
                          setInternalNoteText(a.internalNotes || '');
                        }}
                        className="bg-silver-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 text-center"
                      >
                        View / Note
                      </button>
                      <button
                        onClick={() => onDelete(a.id)}
                        className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all border border-rose-200 cursor-pointer shrink-0 inline-flex items-center justify-center"
                        title="Delete appointment record"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* DETAIL MODAL: DOCTOR APPOINTMENT */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-silver-900 text-white p-6 flex justify-between items-start shrink-0 border-b border-amber-600/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a880] bg-white/10 px-2.5 py-0.5 rounded-lg border border-[#c5a880]/30">
                      Booking Ref: {selectedAppointment.bookingRef}
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">
                      Logged: {new Date(selectedAppointment.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    {selectedAppointment.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow text-xs text-slate-700">
                {/* General Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Patient Contact Phone</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedAppointment.phone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Specialty Target</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedAppointment.service || 'General Practice'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Reserved Consultation Date</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {new Date(selectedAppointment.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Consultation Chamber Time</span>
                    <span className="text-sm font-semibold text-[#c5a880] uppercase tracking-wide font-bold">{selectedAppointment.time}</span>
                  </div>
                </div>

                {/* Selected Services / Procedures */}
                <div className="space-y-2">
                  <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wider text-[10px]">Specialty Procedures Required</h4>
                  <div className="space-y-2">
                    {selectedAppointment.services && selectedAppointment.services.map(s => (
                      <div key={s.id} className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex items-center justify-between">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="font-serif font-bold text-slate-600">{s.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center px-2">
                      <span className="font-bold text-slate-800">Total Booked Diary Worth:</span>
                      <span className="font-serif font-bold text-base text-slate-800">
                        £{selectedAppointment.services ? selectedAppointment.services.reduce((sum, s) => sum + parsePrice(s.price), 0).toLocaleString() : 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Internal notes and workflow logging */}
                <div className="space-y-3.5 border-t border-slate-150 pt-4">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-silver-900 mb-1">Administrative Dr. Faith Diary Action</h4>
                    <p className="text-[10px] text-slate-400">Save private chamber notes, compliance logs, or status changes</p>
                  </div>
                  
                  <textarea
                    rows={2.5}
                    placeholder="Write doctor private notes here..."
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#003334] focus:ring-1 focus:ring-[#003334] transition-colors"
                  />
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    {/* Status updater */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-500">Diary Status:</span>
                      <div className="flex gap-1 flex-wrap">
                        {['reserved', 'confirmed', 'completed', 'cancelled'].map(st => (
                          <button
                            key={st}
                            onClick={() => {
                              onStatusChange(selectedAppointment.id, st as any);
                              setSelectedAppointment(prev => prev ? { ...prev, status: st as any } : null);
                            }}
                            className={`px-2 py-1 text-[10px] font-extrabold uppercase rounded border transition-colors cursor-pointer ${
                              selectedAppointment.status === st
                                ? 'bg-[#003334] border-[#003334] text-white shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onNoteSave(selectedAppointment.id, internalNoteText);
                        setSelectedAppointment(prev => prev ? { ...prev, internalNotes: internalNoteText } : null);
                      }}
                      className="bg-silver-950 hover:bg-black text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Save Private Note
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
