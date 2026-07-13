"use client";

import React, { useState, useEffect } from 'react';
import { getFloatingMenuConfig, getChatSessions, saveChatSessions } from '../lib/adminStore';
import { ChatSession, ChatMessage } from '../types';
import { Phone, MessageCircle, MapPin, Mail, MessageSquare, X, Send, Headset } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingMenu() {
  const [config, setConfig] = useState(getFloatingMenuConfig());

  useEffect(() => {
    setConfig(getFloatingMenuConfig());
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome-init", text: config.welcomeMessage || "Hello! How can we help you today?", isUser: false, timestamp: new Date().toISOString() }
  ]);
  const [inputValue, setInputValue] = useState("");

  
  const [sessionId, setSessionId] = useState<string>('');
  
  useEffect(() => {
    // Check for existing session ID in localStorage
    let storedSessionId = window.localStorage.getItem('current_client_chat_session_id');
    if (!storedSessionId) {
      storedSessionId = Date.now().toString();
      window.localStorage.setItem('current_client_chat_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
    
    // Poll for messages to receive replies from admin
    const interval = setInterval(() => {
      const sessions = getChatSessions();
      const mySession = sessions.find(s => s.id === storedSessionId);
      if (mySession) {
        setMessages(mySession.messages);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInputValue("");
    
    // Save to global admin store
    const sessions = getChatSessions();
    const existingSessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (existingSessionIndex >= 0) {
      sessions[existingSessionIndex].messages = newMessages;
      sessions[existingSessionIndex].lastUpdated = newMessage.timestamp;
      sessions[existingSessionIndex].unreadCountAdmin += 1;
    } else {
      sessions.push({
        id: sessionId,
        clientName: 'Visitor ' + sessionId.substring(sessionId.length - 4),
        messages: [{
          id: 'welcome-' + sessionId,
          text: config.welcomeMessage || "Hello! How can we help you today?",
          isUser: false,
          timestamp: new Date().toISOString()
        }, newMessage],
        lastUpdated: newMessage.timestamp,
        unreadCountAdmin: 1
      });
    }
    saveChatSessions(sessions);
  };


  const actions = [
    {
      label: 'Call Now',
      icon: <Phone className="h-5 w-5 text-silver-700 group-hover:text-[#003334]" />,
      href: `tel:${config.phone.replace(/[^0-9+]/g, '')}`,
      color: 'hover:bg-silver-100'
    },
    {
      label: 'WhatsApp',
      icon: <MessageCircle className="h-5 w-5 text-silver-700 group-hover:text-black" />,
      href: 'https://wa.me/919876543210',
      color: 'hover:bg-black'
    },
    {
      label: 'Location',
      icon: <MapPin className="h-5 w-5 text-silver-700 group-hover:text-[#003334]" />,
      href: `https://maps.google.com/?q=${encodeURIComponent(config.address)}`,
      color: 'hover:bg-silver-100'
    },
    {
      label: 'Email Us',
      icon: <Mail className="h-5 w-5 text-silver-700 group-hover:text-[#003334]" />,
      href: `mailto:${config.email}`,
      color: 'hover:bg-silver-100'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end">
      
      {/* Live Chat Window */}
      <AnimatePresence>
        {isChatOpen && config.enableChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-4 bg-white rounded-2xl shadow-2xl flex flex-col border border-silver-200 w-72 sm:w-80 h-96 overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-[#003334] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Headset className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wider">Customer Support</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-silver-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.isUser ? 'bg-[#003334] text-white rounded-br-sm' : 'bg-white text-silver-800 shadow-sm border border-silver-100 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-silver-200">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-silver-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#003334] text-silver-900"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 rounded-full bg-[#003334] text-white flex items-center justify-center shrink-0 disabled:opacity-50 transition-opacity"
                >
                  <Send className="w-4 h-4 -ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {isOpen && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col space-y-3 mb-4 origin-bottom items-end"
          >
            {actions.map((act, idx) => (
              <div key={idx} className="relative group flex items-center justify-end">
                <a
                  href={act.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all shadow-lg border border-silver-200 group-hover:scale-110 ${act.color}`}
                >
                  {act.icon}
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-3">
        {!isOpen && !isChatOpen && config.enableChat && (
          <div 
            onClick={() => setIsChatOpen(true)}
            className="flex items-center bg-white border border-silver-200 rounded-full h-14 px-4 shadow-2xl w-[55vw] sm:w-[240px] max-w-[240px] cursor-text hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="text-silver-400 text-sm flex-1 text-left truncate">Type a message...</span>
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 ml-2">
              <Send className="w-4 h-4 -ml-0.5" />
            </div>
          </div>
        )}
        
        <button
          onClick={() => {
            if (isChatOpen) {
              setIsChatOpen(false);
            } else {
              setIsOpen(!isOpen);
            }
          }}
          className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-all focus:outline-none z-10 hover:scale-105"
        >
          {isOpen || isChatOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
