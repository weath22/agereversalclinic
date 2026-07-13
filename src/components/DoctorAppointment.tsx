import React, { useState, useEffect } from 'react';
import { saveAppointment } from '../lib/adminStore';
import { motion, AnimatePresence } from 'motion/react';
import { User, Phone, Calendar, Clock, Sparkles, CheckCircle, HelpCircle, DollarSign, Plus, Trash2, X } from 'lucide-react';
import { TREATMENT_DETAILS_DB } from './treatments/treatmentData';

import { CLINICAL_AREAS_DB, findTreatmentInDB } from './LocationsAndConsultation';

interface DoctorAppointmentProps {
  preselectedService?: string;
  onSuccess: () => void;
  onTreatmentClick?: (name: string) => void;
}

export default function DoctorAppointment({ preselectedService, onSuccess, onTreatmentClick }: DoctorAppointmentProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    service: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const [selectedAreaId, setSelectedAreaId] = useState<string>('face');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('injectables');
  const [selectedServices, setSelectedServices] = useState<string[]>(['exosome']);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const addService = (id: string) => {
    if (!selectedServices.includes(id)) {
      setSelectedServices(prev => [...prev, id]);
    }
  };

  const removeService = (id: string) => {
    if (selectedServices.length > 1) {
      setSelectedServices(prev => prev.filter(s => s !== id));
    }
  };

  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  };

  const getSelectedServicesData = () => {
    const list: Array<{ areaName: string, catName: string, id: string, name: string, price: string, time: string, desc: string }> = [];
    selectedServices.forEach(sid => {
      for (const area of CLINICAL_AREAS_DB) {
        for (const cat of area.categories) {
          const found = cat.items.find(i => i.id === sid);
          if (found) {
            list.push({
              areaName: area.name,
              catName: cat.name,
              ...found
            });
            break;
          }
        }
      }
    });
    return list;
  };

  // Handle Area Change
  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    const area = CLINICAL_AREAS_DB.find(a => a.id === areaId);
    if (area && area.categories.length > 0) {
      const firstCat = area.categories[0];
      setSelectedCategoryId(firstCat.id);
      if (firstCat.items.length > 0) {
        setFormData(prev => ({ ...prev, service: firstCat.items[0].id }));
      }
    }
  };

  // Handle Category Change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    const area = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId);
    const cat = area?.categories.find(c => c.id === catId);
    if (cat && cat.items.length > 0) {
      setFormData(prev => ({ ...prev, service: cat.items[0].id }));
    }
  };

  // Auto-fill preferred service when preselectedService changes
  useEffect(() => {
    if (preselectedService) {
      const found = findTreatmentInDB(preselectedService);
      if (found) {
        setSelectedAreaId(found.area.id);
        setSelectedCategoryId(found.category.id);
        setFormData(prev => ({ ...prev, service: found.item.id }));
        setSelectedServices([found.item.id]);
      } else {
        setSelectedAreaId('face');
        setSelectedCategoryId('injectables');
        setFormData(prev => ({ ...prev, service: 'exosome' }));
        setSelectedServices(['exosome']);
      }
    } else {
      setSelectedAreaId('face');
      setSelectedCategoryId('injectables');
      setFormData(prev => ({ ...prev, service: 'exosome' }));
      setSelectedServices(['exosome']);
    }
  }, [preselectedService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Please enter your name';
    if (!formData.phone.trim()) {
      errors.phone = 'Please enter your phone number';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!formData.date) errors.date = 'Please pick a desired date';
    if (!formData.time) errors.time = 'Please pick a preferred slot';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate clinical reference code creation
    const refCode = `ARC-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(refCode);

    const selectedServicesData = getSelectedServicesData().map(item => ({
      id: item.id,
      name: item.name,
      price: item.price
    }));

    saveAppointment({
      name: formData.name,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      service: formData.service || 'exosome',
      bookingRef: refCode,
      services: selectedServicesData
    });

    setShowSuccessModal(true);
    onSuccess();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '',
      service: 'exosome'
    });
    setSelectedAreaId('face');
    setSelectedCategoryId('injectables');
    setSelectedServices(['exosome']);
    setShowSuccessModal(false);
  };

  return (
    <section id="contact" className="py-24 bg-silver-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center max-w-6xl mx-auto">
          
          {/* Left Column: Doctor Profile Segment */}
          <div className="w-full lg:w-3/5 flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* Dr. Portrait */}
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white relative group">
                <img
                  alt="Dr. Faith Nzurike in clinic"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDddaCi7PsPNTwV7AiEWxAoBSKDc9x7oJb4yFMVO41f99W4wxnnsgcI6AzvsOCf4kSCE8EDCAOgvLeEfBhBAJqjpM00DsGFv8_3x2tYtIe6sFTplMAF9SLyrwFaIWhlfrTIF4wOh7dR5swda_bf9ss9jn1vOr5QOYEgWeCxEODworWQ1wvIOUWEoW4mKN15tNvMocfNZjw7xG4qU0sKbOB2UrkHu3YPQoq-WswAXNY-4y2nGG1mBgta8XV5lBlewVQ242-xoDTjIW1l"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* Profile Bio details */}
            <div className="w-full md:w-1/2 flex flex-col">
              <span className="text-xs font-bold text-silver-500 uppercase tracking-widest mb-2 block">
                MEET THE RESIDENT CHIEF
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-silver-900 mb-6 leading-tight">
                Dr. Faith Nzurike
              </h2>
              
              <p className="text-silver-600 mb-8 leading-relaxed text-sm">
                Dr. Faith Nzurike is a highly celebrated specialist dermatologist in Jaipur and London with over 10+ years of active experience in medical, surgical, and cosmetic dermatology. She is dedicated to delivering personalized, state-of-the-art non-invasive age-reversal treatments with total precision and care.
              </p>

              {/* Achievements row */}
              <div className="grid grid-cols-3 gap-4 mb-8 border-t border-silver-200/60 pt-6">
                <div>
                  <span className="text-2xl md:text-3xl font-serif font-bold text-silver-900 block">10+</span>
                  <span className="text-[10px] text-silver-400 uppercase font-bold tracking-wider">Years Experience</span>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-serif font-bold text-silver-900 block">1K+</span>
                  <span className="text-[10px] text-silver-400 uppercase font-bold tracking-wider">Happy Patients</span>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-serif font-bold text-silver-900 block">20+</span>
                  <span className="text-[10px] text-silver-400 uppercase font-bold tracking-wider">Specialties</span>
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => {
                  const el = document.getElementById('leadership');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-silver-200 text-silver-800 border border-silver-300 px-6 py-3 rounded-lg shadow-sm transition-all font-semibold flex items-center justify-center space-x-2 w-fit text-sm"
              >
                <span>Read Board Certification</span>
              </button>
            </div>

          </div>

          {/* Right Column: Appointment Form Container */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-silver-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-gold" />

              <h3 className="text-2xl font-bold font-serif text-silver-900 mb-2">
                Book Consultation
              </h3>
              <p className="text-xs text-silver-500 mb-6">
                Request an appointment slot today. Our advisors will contact you to verify details.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4.5 w-4.5 text-silver-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-silver-100/50 border rounded-xl focus:ring-2 focus:ring-silver-800 focus:border-transparent outline-none transition-all ${
                      formErrors.name ? 'border-red-400 bg-red-50/20' : 'border-silver-200'
                    }`}
                    placeholder="Your Full Name"
                  />
                  {formErrors.name && (
                    <span className="text-[10px] text-red-500 font-semibold block mt-1 pl-1">{formErrors.name}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4.5 w-4.5 text-silver-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-silver-100/50 border rounded-xl focus:ring-2 focus:ring-silver-800 focus:border-transparent outline-none transition-all ${
                      formErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-silver-200'
                    }`}
                    placeholder="Phone Number (e.g. +91 98765 43210)"
                  />
                  {formErrors.phone && (
                    <span className="text-[10px] text-red-500 font-semibold block mt-1 pl-1">{formErrors.phone}</span>
                  )}
                </div>

                 {/* Treatment/Service selection cascade */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-silver-500 uppercase tracking-wider block">Procedure / Treatment of Interest</span>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Area Select */}
                    <div className="relative">
                      <select
                        value={selectedAreaId}
                        onChange={(e) => handleAreaChange(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 text-sm bg-silver-100/50 border border-silver-200 rounded-xl focus:ring-2 focus:ring-silver-800 focus:border-transparent outline-none transition-all appearance-none text-silver-700 cursor-pointer font-semibold"
                      >
                        {CLINICAL_AREAS_DB.map(area => (
                          <option key={area.id} value={area.id}>
                            Area: {area.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-silver-400 text-xs">
                        ▼
                      </div>
                    </div>

                    {/* Category Select */}
                    <div className="relative">
                      <select
                        value={selectedCategoryId}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 text-sm bg-silver-100/50 border border-silver-200 rounded-xl focus:ring-2 focus:ring-silver-800 focus:border-transparent outline-none transition-all appearance-none text-silver-700 cursor-pointer font-semibold"
                      >
                        {CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId)?.categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            Category: {cat.name}
                          </option>
                        )) || <option value="">Select Category</option>}
                      </select>
                      <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-silver-400 text-xs">
                        ▼
                      </div>
                    </div>

                    {/* Treatment Select */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Sparkles className="h-4.5 w-4.5 text-silver-400" />
                      </div>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                        className="w-full pl-10 pr-10 py-3 text-sm bg-silver-100/50 border border-silver-200 rounded-xl focus:ring-2 focus:ring-silver-800 focus:border-transparent outline-none transition-all appearance-none text-silver-700 cursor-pointer font-bold"
                      >
                        {CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId)
                          ?.categories.find(c => c.id === selectedCategoryId)
                          ?.items.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.price})
                            </option>
                          )) || <option value="">Select Treatment</option>}
                      </select>
                      <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-silver-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Breadcrumb Path Display: "face: INJECTABLE TREATMENTS: Exosome" */}
                  {(() => {
                    const areaObj = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId);
                    const catObj = areaObj?.categories.find(c => c.id === selectedCategoryId);
                    const itemObj = catObj?.items.find(i => i.id === formData.service);
                    if (!areaObj || !catObj || !itemObj) return null;
                    return (
                      <div className="flex flex-wrap items-center gap-1 bg-silver-100/60 border border-silver-200/40 rounded-lg px-2.5 py-1.5 text-[10px] text-silver-700 font-medium font-mono">
                        <span className="text-amber-800 font-bold uppercase">{areaObj.id}</span>
                        <span className="text-silver-400">:</span>
                        <span className="text-silver-500 font-bold uppercase">{catObj.name}</span>
                        <span className="text-silver-400">:</span>
                        <span className="text-silver-900 font-bold">{itemObj.name}</span>
                      </div>
                    );
                  })()}

                  {/* Sleek Dynamic UI for chosen service */}
                  {(() => {
                    const areaObj = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId);
                    const catObj = areaObj?.categories.find(c => c.id === selectedCategoryId);
                    const currentTreatment = catObj?.items.find(i => i.id === formData.service);
                    if (!currentTreatment) return null;
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                        key={currentTreatment.id}
                        className="bg-silver-100/80 border border-silver-200/60 rounded-2xl p-4 space-y-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-500/10 px-2 py-0.5 rounded">
                            {catObj.name}
                          </span>
                          <h4 className="text-sm font-bold text-silver-900 leading-snug">
                            {currentTreatment.name}
                          </h4>
                          <p className="text-[11px] text-silver-500 leading-relaxed">
                            {currentTreatment.desc}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Investment */}
                          <div 
                            onClick={() => onTreatmentClick?.(currentTreatment.name)}
                            title="Click to view treatment details"
                            className="bg-white border border-silver-200/40 hover:border-silver-400 p-2.5 rounded-xl flex items-center gap-2 min-w-0 cursor-pointer transition-all hover:bg-slate-50/80 active:scale-[0.98] shadow-sm hover:shadow-md"
                          >
                            <div className="p-1.5 bg-silver-100 text-silver-700 rounded-lg shrink-0">
                              <DollarSign className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[8px] uppercase tracking-wider text-silver-400 block font-bold truncate">Price</span>
                              <span className="font-bold text-silver-800 font-serif block truncate">{currentTreatment.price}</span>
                            </div>
                          </div>

                          {/* Duration */}
                          <div 
                            onClick={() => onTreatmentClick?.(currentTreatment.name)}
                            title="Click to view treatment details"
                            className="bg-white border border-silver-200/40 hover:border-silver-400 p-2.5 rounded-xl flex items-center gap-2 min-w-0 cursor-pointer transition-all hover:bg-slate-50/80 active:scale-[0.98] shadow-sm hover:shadow-md"
                          >
                            <div className="p-1.5 bg-silver-100 text-silver-700 rounded-lg shrink-0">
                              <Clock className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[8px] uppercase tracking-wider text-silver-400 block font-bold truncate">Time</span>
                              <span className="font-bold text-silver-800 block truncate">{currentTreatment.time}</span>
                            </div>
                          </div>
                        </div>

                        {/* Toggle Add to Selection Button */}
                        <div className="pt-3 border-t border-silver-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <p className="text-[10px] text-silver-500">
                            {selectedServices.includes(currentTreatment.id)
                              ? "✓ This treatment is in your slot request."
                              : "Would you like to add this treatment?"}
                          </p>
                          {selectedServices.includes(currentTreatment.id) ? (
                            <button
                              type="button"
                              disabled={selectedServices.length <= 1}
                              onClick={() => removeService(currentTreatment.id)}
                              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                                selectedServices.length <= 1
                                  ? "bg-silver-200 text-silver-400 cursor-not-allowed border border-transparent"
                                  : "bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 cursor-pointer"
                              }`}
                            >
                              <Trash2 className="h-3 w-3" /> Remove from Slot
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addService(currentTreatment.id)}
                              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-silver-900 hover:bg-black text-white px-3.5 py-2 rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
                            >
                              <Plus className="h-3 w-3" /> Add to Slot
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })()}

                  {/* Selected Services Summary Card (Cart-like Item) */}
                  {selectedServices.length > 0 && (
                    <div 
                      onClick={() => setIsDrawerOpen(true)}
                      className="bg-gradient-to-r from-silver-900 to-slate-950 text-white p-4 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition-all cursor-pointer border border-silver-800 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="hidden sm:block relative p-2 bg-[#c5a880]/20 rounded-lg text-[#c5a880] shrink-0 group-hover:scale-105 transition-transform">
                          <Sparkles className="h-4 w-4" />
                          <span className="absolute -top-1 -right-1 bg-[#c5a880] text-silver-950 text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-silver-950">
                            {selectedServices.length}
                          </span>
                        </div>
                        <div className="text-left min-w-0">
                          <span className="text-[8px] uppercase tracking-wider text-silver-300 font-extrabold block">Selected Services</span>
                          <span className="text-[11px] font-bold text-white block truncate">
                            {selectedServices.length} Treatment{selectedServices.length > 1 ? 's' : ''} Selected
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right">
                          <span className="text-[8px] uppercase tracking-wider text-[#c5a880]/90 block font-extrabold">Total Est.</span>
                          <span className="text-xs font-bold font-serif text-[#c5a880]">
                            ${getSelectedServicesData().reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}
                          </span>
                        </div>
                        <span className="hidden sm:inline-block bg-white/10 px-2.5 py-1 rounded-lg text-[9px] font-bold hover:bg-white/15 transition-all text-white border border-white/5 uppercase tracking-wide shrink-0">
                          Review
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Custom Bottom Mobile Drawer for Selected Services */}
                  <AnimatePresence>
                    {isDrawerOpen && (
                      <div className="fixed inset-0 z-50">
                        {/* Backdrop Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsDrawerOpen(false)}
                          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        {/* Slide-Up Drawer */}
                        <motion.div
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "100%" }}
                          transition={{ type: "spring", damping: 25, stiffness: 200 }}
                          className="fixed bottom-0 left-0 right-0 md:max-w-xl md:mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col font-sans z-50 max-h-[85vh] overflow-hidden"
                        >
                          {/* Drag Handle */}
                          <div className="w-12 h-1.5 bg-silver-200 rounded-full mx-auto my-3 shrink-0 cursor-pointer hover:bg-silver-300 transition-colors" onClick={() => setIsDrawerOpen(false)} />
                          
                          {/* Header */}
                          <div className="px-6 pb-4 border-b border-silver-100 flex items-center justify-between shrink-0">
                            <div>
                              <h4 className="font-serif font-bold text-base text-silver-900">Your Appointment Selection</h4>
                              <p className="text-[11px] text-silver-500">Review, add, or prune selected clinical services</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsDrawerOpen(false)}
                              className="p-1.5 bg-silver-50 hover:bg-silver-100 text-silver-500 rounded-full transition-all"
                            >
                              <X className="h-4.5 w-4.5" />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
                            {getSelectedServicesData().map((item) => (
                              <div 
                                key={item.id}
                                className="flex items-center justify-between gap-4 bg-silver-50 border border-silver-100 p-3.5 rounded-xl shadow-sm"
                              >
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[8px] font-bold text-silver-500 uppercase tracking-wide bg-silver-200/50 px-1.5 py-0.5 rounded">
                                      {item.areaName}
                                    </span>
                                    <span className="text-[8px] font-bold text-amber-800 uppercase tracking-wide truncate bg-amber-500/10 px-1.5 py-0.5 rounded">
                                      {item.catName}
                                    </span>
                                  </div>
                                  <h5 className="font-sans font-bold text-xs text-silver-900">
                                    {item.name}
                                  </h5>
                                  <p className="text-[11px] text-silver-500 leading-relaxed line-clamp-2">
                                    {item.desc}
                                  </p>
                                  <div className="flex items-center gap-2.5 text-[10px] text-silver-400 font-semibold pt-0.5">
                                    <span className="flex items-center gap-0.5">
                                      <Clock className="h-3 w-3 text-silver-400 shrink-0" /> {item.time}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5 font-bold text-silver-800">
                                      <DollarSign className="h-2.5 w-2.5 text-silver-400 shrink-0" /> {item.price}
                                    </span>
                                  </div>
                                </div>

                                {/* Remove button */}
                                {selectedServices.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeService(item.id)}
                                    className="p-2 bg-white hover:bg-red-50 text-silver-400 hover:text-red-600 rounded-xl transition-all border border-silver-200/50 hover:border-red-100 shrink-0 shadow-sm"
                                    title="Remove treatment"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="p-6 bg-silver-50 border-t border-silver-100 space-y-4 shrink-0 rounded-t-2xl shadow-inner">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-[10px] uppercase tracking-wider text-silver-500 font-extrabold block">
                                  Estimated Investment Total
                                </span>
                                <span className="text-[10px] text-silver-400 block font-medium">
                                  {selectedServices.length} treatment{selectedServices.length > 1 ? 's' : ''} in request
                                </span>
                              </div>
                              <span className="font-serif font-bold text-lg text-silver-900">
                                ${getSelectedServicesData().reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}
                              </span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => setIsDrawerOpen(false)}
                              className="w-full bg-silver-900 hover:bg-black text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              Confirm Selection & Close Drawer
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar className="h-4.5 w-4.5 text-silver-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-silver-100/50 border rounded-xl focus:ring-2 focus:ring-silver-800 focus:border-transparent outline-none transition-all text-silver-700 ${
                      formErrors.date ? 'border-red-400 bg-red-50/20' : 'border-silver-200'
                    }`}
                  />
                  {formErrors.date && (
                    <span className="text-[10px] text-red-500 font-semibold block mt-1 pl-1">{formErrors.date}</span>
                  )}
                </div>

                {/* Time Slots */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Clock className="h-4.5 w-4.5 text-silver-400" />
                  </div>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-silver-100/50 border rounded-xl focus:ring-2 focus:ring-silver-800 focus:border-transparent outline-none transition-all text-silver-700 ${
                      formErrors.time ? 'border-red-400 bg-red-50/20' : 'border-silver-200'
                    }`}
                  >
                    <option value="">Choose a preferred time slot</option>
                    <option value="09:30 AM">09:30 AM (Morning session)</option>
                    <option value="11:30 AM">11:30 AM (Midday session)</option>
                    <option value="02:30 PM">02:30 PM (Afternoon session)</option>
                    <option value="04:00 PM">04:00 PM (Late afternoon session)</option>
                  </select>
                  {formErrors.time && (
                    <span className="text-[10px] text-red-500 font-semibold block mt-1 pl-1">{formErrors.time}</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-silver-900 hover:bg-black text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 uppercase tracking-wider text-xs md:text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Consultation Now</span>
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Booking Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={resetForm}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl max-w-md w-full text-center relative z-10 border border-silver-200"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:h-10 text-emerald-500 stroke-[1.5]" />
              </div>

              <h4 className="text-xl sm:text-2xl font-serif font-bold text-silver-900 mb-2">
                Booking Received
              </h4>
              <p className="text-silver-500 text-xs sm:text-sm mb-4 leading-relaxed px-1">
                Thank you, <strong className="text-silver-900">{formData.name}</strong>. Your provisional slot on <strong className="text-silver-900">{formData.date} ({formData.time})</strong> has been reserved. Our clinic advisors will call you shortly on <strong className="text-silver-900">{formData.phone}</strong> to finalize.
              </p>

              {/* Selected Treatments list inside success modal */}
              <div className="my-4 sm:my-5 bg-silver-50 border border-silver-200 rounded-xl sm:rounded-2xl p-4 text-left space-y-3 shadow-sm">
                <span className="text-[9px] font-bold uppercase tracking-wider text-silver-400 block border-b border-silver-200 pb-1.5">
                  Treatment Request Summary ({selectedServices.length})
                </span>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {getSelectedServicesData().map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-2.5 text-xs">
                      <span className="font-semibold text-silver-800 truncate">{item.name}</span>
                      <span className="font-serif font-bold text-amber-800 shrink-0">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-silver-200 pt-1.5 flex justify-between items-center text-xs font-bold text-silver-900">
                  <span>Total Investment:</span>
                  <span className="font-serif text-[#c5a880]">
                    ${getSelectedServicesData().reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Code Card */}
              <div className="bg-silver-100 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl mb-5 sm:mb-6 border border-silver-200 inline-block w-full">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-silver-400 block mb-1">
                  Clinical Confirmation Reference
                </span>
                <span className="text-lg sm:text-xl font-mono font-bold text-silver-800">
                  {bookingRef}
                </span>
              </div>

              <button
                onClick={resetForm}
                className="w-full bg-silver-900 hover:bg-black text-white font-bold py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow cursor-pointer"
              >
                Dismiss &amp; Return
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
