"use client";

import React, { useState } from 'react';
import { 
  Users, Search, Trash2, X, CheckCircle, Mail, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ConsultationRequest } from '../types';

interface ConsultationRequestsManagerProps {
  consultations: ConsultationRequest[];
  onStatusChange: (id: string, status: ConsultationRequest['status']) => void;
  onNoteSave: (id: string, noteText: string) => void;
  onDelete: (id: string) => void;
}

export default function ConsultationRequestsManager({
  consultations,
  onStatusChange,
  onNoteSave,
  onDelete
}: ConsultationRequestsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
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
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'contacted':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'booked':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  // Filter consultations
  const filteredConsultations = consultations.filter((c) => {
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const treatments = c.treatments ? c.treatments.map(t => t.name.toLowerCase()).join(' ') : '';
    
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase()) ||
      treatments.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
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
            placeholder="Search by patient name, email, phone or treatments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#003334] focus:ring-1 focus:ring-[#003334] transition-colors"
          />
        </div>

        {/* Status Tabs/Select */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'pending', label: 'Pending' },
            { id: 'contacted', label: 'Contacted' },
            { id: 'booked', label: 'Booked' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === item.id
                  ? 'bg-[#003334] text-white shadow-sm'
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
            <h3 className="font-serif font-bold text-lg text-[#003334]">Clinical Consultation Plan Queue</h3>
            <p className="text-xs text-slate-500">Manage patient-submitted diagnostic requests and coordinate callback schedules</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono font-bold">
            Showing {filteredConsultations.length} records
          </span>
        </div>

        {filteredConsultations.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Users className="h-12 w-12 mx-auto opacity-40" />
            <p className="font-medium text-sm">No matching consultation requests found.</p>
            <p className="text-xs">Adjust filters or search parameters and try again.</p>
          </div>
        ) : (
          <>
            {/* Desktop and Tablet Landscape: Table view */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold font-sans">
                    <th className="py-3.5 px-6">Patient Name</th>
                    <th className="py-3.5 px-6">Submitted Date / Reach</th>
                    <th className="py-3.5 px-6">Clinical Treatments Plan</th>
                    <th className="py-3.5 px-6">Est. Investment</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredConsultations.map((c) => {
                    const totalWorth = c.treatments ? c.treatments.reduce((sum, t) => sum + parsePrice(t.price), 0) : 0;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-sans font-bold text-slate-800 text-sm">{c.firstName} {c.lastName}</div>
                          <div className="text-slate-400 text-[11px] font-mono">{c.email} • {c.phone}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div>{new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                          <div className="text-[11px] text-slate-400 uppercase tracking-wide font-semibold">Pref: {c.bestTime}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            {c.treatments && c.treatments.map(t => (
                              <span key={t.id} className="inline-block bg-[#003334]/5 text-[#003334] px-2 py-0.5 rounded text-[10px] font-semibold border border-[#003334]/10 mr-1.5">
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-serif font-bold text-slate-800 text-sm">
                          £{totalWorth.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusBadgeClass(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedConsultation(c);
                              setInternalNoteText(c.internalNotes || '');
                            }}
                            className="bg-[#003334]/10 hover:bg-[#003334] text-[#003334] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            View / Note
                          </button>
                          <button
                            onClick={() => onDelete(c.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all border border-transparent hover:border-rose-100 cursor-pointer inline-flex items-center justify-center align-middle"
                            title="Delete consultation request"
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
              {filteredConsultations.map((c) => {
                const totalWorth = c.treatments ? c.treatments.reduce((sum, t) => sum + parsePrice(t.price), 0) : 0;
                return (
                  <div key={c.id} className="p-5 space-y-4 hover:bg-slate-50/30 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-sans font-bold text-slate-800 text-sm">{c.firstName} {c.lastName}</div>
                        <div className="text-slate-400 text-[11px] font-mono break-all mt-0.5">{c.email}</div>
                        <div className="text-slate-400 text-[11px] font-mono mt-0.5">{c.phone}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider ${getStatusBadgeClass(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs border-t border-b border-slate-100 py-3 bg-slate-50/50 p-3 rounded-xl">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Preferred Callback</span>
                        <div className="font-semibold text-slate-700 mt-0.5">{new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[10px] text-[#c5a880] uppercase tracking-wide font-bold mt-0.5">{c.bestTime}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Est. Investment</span>
                        <div className="font-serif font-black text-[#003334] text-base mt-0.5">£{totalWorth.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Treatments Plan</span>
                      <div className="flex flex-wrap gap-1">
                        {c.treatments && c.treatments.map(t => (
                          <span key={t.id} className="inline-block bg-[#003334]/5 text-[#003334] px-2.5 py-1 rounded text-[10px] font-semibold border border-[#003334]/10">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100/50">
                      <button
                        onClick={() => {
                          setSelectedConsultation(c);
                          setInternalNoteText(c.internalNotes || '');
                        }}
                        className="bg-[#003334] hover:bg-[#236963] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 text-center"
                      >
                        View / Note
                      </button>
                      <button
                        onClick={() => onDelete(c.id)}
                        className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all border border-rose-200 cursor-pointer shrink-0 inline-flex items-center justify-center"
                        title="Delete consultation request"
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

      {/* DETAIL MODAL: CONSULTATION REQUEST */}
      <AnimatePresence>
        {selectedConsultation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-[#003334] text-white p-6 flex justify-between items-start shrink-0 border-b border-[#c5a880]/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a880] bg-[#c5a880]/15 px-2.5 py-0.5 rounded-lg border border-[#c5a880]/30">
                      Consultation ID: {selectedConsultation.id}
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">
                      Received: {new Date(selectedConsultation.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    {selectedConsultation.firstName} {selectedConsultation.lastName}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedConsultation(null)}
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
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-semibold text-slate-800 break-all">{selectedConsultation.email}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedConsultation.phone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Preferred Clinical Date</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {new Date(selectedConsultation.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Best Recall Slot</span>
                    <span className="text-sm font-semibold text-slate-800 uppercase">{selectedConsultation.bestTime}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Acquisition Channel</span>
                    <span className="text-sm font-semibold text-slate-800 uppercase">{selectedConsultation.hearAboutUs}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Preferred Doctor</span>
                    <span className="text-sm font-semibold text-slate-800 uppercase">{selectedConsultation.doctor || 'No Preference'}</span>
                  </div>
                </div>

                {/* Selected Treatments */}
                <div className="space-y-2">
                  <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wider text-[10px]">Selected Clinical Treatments</h4>
                  <div className="space-y-2">
                    {selectedConsultation.treatments && selectedConsultation.treatments.map(t => (
                      <div key={t.id} className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex items-center justify-between">
                        <span className="font-bold text-slate-800">{t.name}</span>
                        <span className="font-serif font-bold text-[#c5a880]">{t.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center px-2">
                      <span className="font-bold text-slate-800">Total Pipeline Value:</span>
                      <span className="font-serif font-bold text-base text-[#c5a880]">
                        £{selectedConsultation.treatments ? selectedConsultation.treatments.reduce((sum, t) => sum + parsePrice(t.price), 0).toLocaleString() : 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Desired Improvement Area</span>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium leading-relaxed italic text-slate-600">
                      "{selectedConsultation.improvement || 'None declared.'}"
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Additional Consultation Notes</span>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium leading-relaxed text-slate-600">
                      "{selectedConsultation.notes || 'No notes.'}"
                    </div>
                  </div>
                </div>

                {/* Stay in Touch preferences list */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Preferred Contact Mediums</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedConsultation.stayInTouch && selectedConsultation.stayInTouch.map(channel => (
                      <span key={channel} className="bg-[#003334]/5 text-[#003334] font-semibold px-2.5 py-1 rounded text-[10px] uppercase tracking-wide border border-[#003334]/10">
                        {channel}
                      </span>
                    ))}
                    {selectedConsultation.agreeOffers && (
                      <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded text-[10px] uppercase tracking-wide border border-emerald-100">
                        Opted into marketing
                      </span>
                    )}
                  </div>
                </div>

                {/* Internal notes and workflow logging */}
                <div className="space-y-3.5 border-t border-slate-150 pt-4">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#003334] mb-1">Administrative Action Board</h4>
                    <p className="text-[10px] text-slate-400">Log private clinical notes, telephone summaries, or patient compliance reviews</p>
                  </div>
                  
                  <textarea
                    rows={2.5}
                    placeholder="Write administrative callback notes here..."
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#003334] focus:ring-1 focus:ring-[#003334] transition-colors"
                  />
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    {/* Status updater */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-500">Update Status:</span>
                      <div className="flex gap-1 flex-wrap">
                        {['pending', 'contacted', 'booked', 'cancelled'].map(st => (
                          <button
                            key={st}
                            onClick={() => {
                              onStatusChange(selectedConsultation.id, st as any);
                              setSelectedConsultation(prev => prev ? { ...prev, status: st as any } : null);
                            }}
                            className={`px-2 py-1 text-[10px] font-extrabold uppercase rounded border transition-colors cursor-pointer ${
                              selectedConsultation.status === st
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
                        onNoteSave(selectedConsultation.id, internalNoteText);
                        setSelectedConsultation(prev => prev ? { ...prev, internalNotes: internalNoteText } : null);
                      }}
                      className="bg-[#c5a880] hover:bg-[#b0936b] text-[#003334] font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Save Internal Note
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
