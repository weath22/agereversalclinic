'use client';

import React, { useState, useEffect } from 'react';
import { getChatSessions, saveChatSessions } from '../lib/adminStore';
import { ChatSession, ChatMessage } from '../types';
import { Send, User, Clock, CheckCircle2, MessageCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatSupportManager() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    // Initial load
    setSessions(getChatSessions());

    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      setSessions(getChatSessions());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Mark as read when active session changes
  useEffect(() => {
    if (activeSessionId) {
      const updatedSessions = sessions.map(s => {
        if (s.id === activeSessionId && s.unreadCountAdmin > 0) {
          return { ...s, unreadCountAdmin: 0 };
        }
        return s;
      });
      setSessions(updatedSessions);
      saveChatSessions(updatedSessions);
    }
  }, [activeSessionId, sessions]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeSessionId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: replyText,
      isUser: false,
      timestamp: new Date().toISOString()
    };

    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [...s.messages, newMessage],
          lastUpdated: new Date().toISOString()
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    saveChatSessions(updatedSessions);
    setReplyText('');
  };

  const handleResolveSession = (id: string) => {
    const updatedSessions = sessions.filter(s => s.id !== id);
    setSessions(updatedSessions);
    saveChatSessions(updatedSessions);
    if (activeSessionId === id) setActiveSessionId(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-140px)] flex relative">
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-1/3 border-r border-slate-200 flex-col bg-slate-50 h-full ${activeSessionId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-serif font-bold text-luxury-text flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-luxury-gold" />
            Live Support
          </h2>
          <p className="text-sm text-luxury-subtext mt-1">Manage client conversations</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-luxury-muted text-sm flex flex-col items-center">
              <MessageCircle className="w-8 h-8 mb-3 opacity-20" />
              <p>No active conversations</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {sessions.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).map(session => (
                <div 
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`p-4 cursor-pointer hover:bg-slate-100 transition-colors ${activeSessionId === session.id ? 'bg-luxury-secondary/50 border-l-4 border-l-luxury-gold' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-luxury-text flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5" />
                      {session.clientName || session.id.substring(0, 8)}
                    </h3>
                    <span className="text-[10px] text-luxury-muted whitespace-nowrap ml-2">
                      {new Date(session.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs text-luxury-subtext truncate flex-1">
                      {session.messages[session.messages.length - 1]?.text || 'Started a conversation'}
                    </p>
                    {session.unreadCountAdmin > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {session.unreadCountAdmin}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`w-full md:w-2/3 flex-col bg-white h-full ${activeSessionId ? 'flex' : 'hidden md:flex'}`}>
        {activeSession ? (
          <>
            <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <button 
                  onClick={() => setActiveSessionId(null)}
                  className="md:hidden p-2 -ml-2 text-luxury-muted hover:text-luxury-text transition-colors rounded-full hover:bg-slate-100 shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h3 className="font-bold text-luxury-text text-lg truncate">{activeSession.clientName || 'Anonymous Client'}</h3>
                  <p className="text-xs text-luxury-muted flex items-center gap-1 truncate">
                    <Clock className="w-3 h-3 shrink-0" />
                    Started {new Date(activeSession.messages[0]?.timestamp || activeSession.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleResolveSession(activeSession.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Resolve & Close</span>
                <span className="sm:hidden">Close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
              {activeSession.messages.map((msg, idx) => (
                <div key={msg.id || idx} className={`flex ${!msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${!msg.isUser ? 'bg-luxury-gold text-white rounded-br-none' : 'bg-white border border-slate-200 text-luxury-text rounded-bl-none'}`}>
                    <p className="break-words">{msg.text}</p>
                    <span className={`text-[9px] mt-1 block ${!msg.isUser ? 'text-white/80 text-right' : 'text-luxury-muted text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendReply} className="flex items-center gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a reply to the client..."
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none text-sm transition-all min-w-0"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center hover:bg-luxury-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-5 h-5 -ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-luxury-muted p-8 text-center bg-slate-50/30">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-serif text-luxury-text mb-2">No Conversation Selected</h3>
            <p className="text-sm max-w-sm">Select a conversation from the sidebar to view messages and reply to clients.</p>
          </div>
        )}
      </div>
    </div>
  );
}
