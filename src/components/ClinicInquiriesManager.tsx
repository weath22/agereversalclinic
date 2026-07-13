"use client";

import React from 'react';
import { 
  MessageSquare, User, Mail, Trash2
} from 'lucide-react';
import { InquiryMessage } from '../types';

interface ClinicInquiriesManagerProps {
  inquiries: InquiryMessage[];
  onReadToggle: (id: string, isRead: boolean) => void;
  onDelete: (id: string) => void;
}

export default function ClinicInquiriesManager({
  inquiries,
  onReadToggle,
  onDelete
}: ClinicInquiriesManagerProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#003334]">Locations Inquiry Inbox</h3>
            <p className="text-xs text-slate-500">Review feedback and customer queries submitted via quick contact panels</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono font-bold">
            {inquiries.length} Messages total
          </span>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <MessageSquare className="h-12 w-12 mx-auto opacity-40" />
            <p className="font-medium text-sm">Inquiry Inbox is completely empty.</p>
            <p className="text-xs">Any customer inquiries will appear here immediately.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-150">
            {inquiries.map((inq) => (
              <div 
                key={inq.id} 
                className={`p-4 sm:p-6 transition-all flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-start ${
                  !inq.isRead ? 'bg-[#c5a880]/5 hover:bg-[#c5a880]/10 border-l-4 border-l-[#c5a880]' : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                }`}
              >
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-3 border-b border-slate-100/50 pb-2 md:border-none md:pb-0 flex-wrap">
                    <span className="text-[10px] font-bold text-[#c5a880] uppercase tracking-wider bg-[#c5a880]/15 px-2.5 py-0.5 rounded-lg border border-[#c5a880]/20">
                      {inq.location}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(inq.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!inq.isRead && (
                      <span className="text-[9px] bg-rose-500 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Unread Msg
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-base text-slate-800">
                    {inq.subject}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-200/60 max-w-4xl break-words">
                    "{inq.message}"
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[11px] text-slate-500 bg-slate-50/50 p-2 rounded-lg border border-slate-100 md:bg-transparent md:p-0 md:border-none">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <User className="h-3.5 w-3.5 shrink-0 text-slate-400" /> Sender: <strong className="text-slate-700 font-bold truncate">{inq.name}</strong>
                    </span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" /> Email: <a href={`mailto:${inq.email}`} className="text-[#003334] font-bold hover:underline break-all truncate">{inq.email}</a>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:self-center w-full md:w-auto justify-end pt-3 border-t border-slate-100 md:pt-0 md:border-none">
                  <button
                    onClick={() => onReadToggle(inq.id, inq.isRead)}
                    className={`flex-1 md:flex-initial px-4 py-2 md:py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center ${
                      inq.isRead
                        ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        : 'bg-[#003334] border-[#003334] text-white hover:bg-[#236963]'
                    }`}
                  >
                    {inq.isRead ? 'Mark Unread' : 'Mark Reviewed'}
                  </button>
                  <button
                    onClick={() => onDelete(inq.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all border border-rose-200 cursor-pointer shrink-0 inline-flex items-center justify-center"
                    title="Delete inquiry message"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
