"use client";

import React, { useState, useEffect } from 'react';
import { 
  getConsultations, 
  updateConsultationStatus, 
  updateConsultationNotes, 
  deleteConsultation,
  getAppointments,
  updateAppointmentStatus,
  updateAppointmentNotes,
  deleteAppointment,
  getInquiries,
  markInquiryAsRead,
  deleteInquiry,
  resetAdminStoreToDefaults,
  getHeaderConfig,
  saveHeaderConfig,
  getHeroConfig,
  saveHeroConfig,
  getSpecialistAreasConfig,
  saveSpecialistAreasConfig,
  getTreatmentsConfig,
  saveTreatmentsConfig
} from '../lib/adminStore';
import { 
  ConsultationRequest, 
  DoctorAppointmentRecord, 
  InquiryMessage,
  HeaderConfig,
  HeroConfig,
  SpecialistAreasConfig,
  TreatmentsConfig,
  SpecialistArea,
  Treatment
} from '../types';
import { 
  ListOrdered, Home, MessageSquareQuote, Tag,
  LayoutDashboard, 
  Calendar, 
  Users, 
  MessageSquare, 
  Layers,
  Search, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  ChevronRight, 
  ChevronDown,
  Database, 
  Download, 
  RefreshCw, 
  Check, 
  Lock, 
  ArrowLeft, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  CalendarDays, 
  MapPin, 
  Heart, 
  FileText, 
  Settings,
  Sparkles,
  ArrowRight,
  Edit,
  Plus,
  Image,
  Video,
  Globe,
  Menu,
  Trophy,
  ShoppingBag,
  Shield,
  Award,
  Newspaper,
  PanelBottom,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GalleryEditor from './GalleryEditor';
import WhyChooseUsEditor from './WhyChooseUsEditor';
import AwardsEditor from './AwardsEditor';
import LocationsEditor from './LocationsEditor';
import TeamLeadershipEditor from './TeamLeadershipEditor';
import ProcessEditor from './ProcessEditor';
import FacilityInteriorsEditor from './FacilityInteriorsEditor';
import TestimonialsEditor from './TestimonialsEditor';
import SpecialOffersEditor from './SpecialOffersEditor';
import SkincareCollectionEditor from './SkincareCollectionEditor';
import TrustBrandsEditor from './TrustBrandsEditor';
import AccreditationsEditor from './AccreditationsEditor';
import LatestNewsEditor from './LatestNewsEditor';
import FooterEditor from './FooterEditor';
import FloatingMenuEditor from './FloatingMenuEditor';
import ServiceViewDetailsEditor from './ServiceViewDetailsEditor';
import ConsultationRequestsManager from './ConsultationRequestsManager';
import DoctorAppointmentsManager from './DoctorAppointmentsManager';
import ClinicInquiriesManager from './ClinicInquiriesManager';
import ChatSupportManager from './ChatSupportManager';
import ProfileDetailsEditor from './ProfileDetailsEditor';


interface AdminDashboardProps {
  onBackToClinic: () => void;
}

export default function AdminDashboard({ onBackToClinic }: AdminDashboardProps) {
  // Passcode gate state
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'appointments' | 'inquiries' | 'migration' | 'edit-service-details' | 'edit-profile-details' | 'edit-header' | 'edit-hero' | 'edit-specialist' | 'edit-treatments' | 'edit-gallery' | 'edit-whychoose' | 'edit-awards' | 'edit-locations' | 'edit-team' | 'edit-process' | 'edit-facility' | 'edit-testimonials' | 'edit-offers' | 'edit-skincare' | 'edit-trust' | 'edit-accreditations' | 'edit-news' | 'edit-footer' | 'edit-floating' | 'chat-support'>('overview');

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isHomepageEditorsOpen, setIsHomepageEditorsOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  // Auto-expand homepage editors group if an editor is active
  useEffect(() => {
    if (activeTab.startsWith('edit-')) {
      setIsHomepageEditorsOpen(true);
    }
  }, [activeTab]);

  // Core database state
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [appointments, setAppointments] = useState<DoctorAppointmentRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);

  // Filter/Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected records for modals
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointmentRecord | null>(null);

  // Note editors
  const [internalNoteText, setInternalNoteText] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Homepage Editor States
  const [hBrandName, setHBrandName] = useState('');
  const [hLogoText, setHLogoText] = useState('');
  const [hTagline, setHTagline] = useState('');

  const [heroBadge, setHeroBadge] = useState('');
  const [heroHeading, setHeroHeading] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroButtonText, setHeroButtonText] = useState('');
  const [heroMediaType, setHeroMediaType] = useState<'video' | 'image'>('video');
  const [heroMediaUrl, setHeroMediaUrl] = useState('');

  const [specHeading, setSpecHeading] = useState('');
  const [specDescription, setSpecDescription] = useState('');
  const [specAreas, setSpecAreas] = useState<SpecialistArea[]>([]);

  const [treatEditorialHeading, setTreatEditorialHeading] = useState('');
  const [treatEditorialSub, setTreatEditorialSub] = useState('');
  const [treatDescription, setTreatDescription] = useState('');
  const [treatList, setTreatList] = useState<Treatment[]>([]);

  // Load homepage editor states on initialization
  useEffect(() => {
    const header = getHeaderConfig();
    setHBrandName(header.primaryName);
    setHLogoText(header.logoUrl);
    setHTagline(header.secondaryName || '');

    const hero = getHeroConfig();
    setHeroBadge(hero.badge);
    setHeroHeading(hero.title);
    setHeroDescription(hero.description);
    setHeroButtonText('');
    setHeroMediaType(hero.mediaType);
    setHeroMediaUrl(hero.mediaUrl);

    const spec = getSpecialistAreasConfig();
    setSpecHeading(spec.heading);
    setSpecDescription(spec.description);
    setSpecAreas(spec.areas || []);

    const treat = getTreatmentsConfig();
    setTreatEditorialHeading(treat.editorialHeading);
    setTreatEditorialSub(treat.editorialSub);
    setTreatDescription(treat.description);
    setTreatList(treat.treatments || []);
  }, []);

  const handleAddSpecArea = () => {
    const newArea: SpecialistArea = {
      id: `area-${Date.now()}`,
      title: 'New Specialist Area',
      description: 'Description of the new specialized clinical care area.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs'
    };
    setSpecAreas([...specAreas, newArea]);
  };

  const handleUpdateSpecArea = (index: number, field: keyof SpecialistArea, value: string) => {
    const updated = [...specAreas];
    updated[index] = { ...updated[index], [field]: value };
    setSpecAreas(updated);
  };

  const handleDeleteSpecArea = (index: number) => {
    setSpecAreas(specAreas.filter((_, i) => i !== index));
  };

  const handleAddTreatmentItem = () => {
    const newTreatment: Treatment = {
      id: `treat-${Date.now()}`,
      name: 'New Custom Treatment',
      price: '£150',
      duration: '45 mins'
    };
    setTreatList([...treatList, newTreatment]);
  };

  const handleUpdateTreatmentItem = (index: number, field: keyof Treatment, value: string) => {
    const updated = [...treatList];
    updated[index] = { ...updated[index], [field]: value };
    setTreatList(updated);
  };

  const handleDeleteTreatmentItem = (index: number) => {
    setTreatList(treatList.filter((_, i) => i !== index));
  };

  const handleSaveHeader = () => {
    saveHeaderConfig({
      primaryName: hBrandName,
      logoUrl: hLogoText,
      secondaryName: hTagline
    });
    showToast('Header & Branding saved successfully!');
  };

  const handleSaveHero = () => {
    saveHeroConfig({
      badge: heroBadge,
      title: heroHeading,
      description: heroDescription,
      mediaType: heroMediaType,
      mediaUrl: heroMediaUrl
    });
    showToast('Hero Section saved successfully!');
  };

  const handleSaveSpecialistAreas = () => {
    saveSpecialistAreasConfig({
      heading: specHeading,
      description: specDescription,
      areas: specAreas
    });
    showToast('Specialist Areas saved successfully!');
  };

  const handleSaveTreatments = () => {
    saveTreatmentsConfig({
      editorialHeading: treatEditorialHeading,
      editorialSub: treatEditorialSub,
      description: treatDescription,
      treatments: treatList
    });
    showToast('Treatments list saved successfully!');
  };

  const handleResetHomepage = () => {
    if (confirm('Are you sure you want to restore the homepage configurations to original defaults? All customized edits will be lost.')) {
      resetAdminStoreToDefaults();
      const header = getHeaderConfig();
      setHBrandName(header.primaryName);
      setHLogoText(header.logoUrl);
      setHTagline(header.secondaryName || '');

      const hero = getHeroConfig();
      setHeroBadge(hero.badge);
      setHeroHeading(hero.title);
      setHeroDescription(hero.description);
      setHeroButtonText('');
      setHeroMediaType(hero.mediaType);
      setHeroMediaUrl(hero.mediaUrl);

      const spec = getSpecialistAreasConfig();
      setSpecHeading(spec.heading);
      setSpecDescription(spec.description);
      setSpecAreas(spec.areas || []);

      const treat = getTreatmentsConfig();
      setTreatEditorialHeading(treat.editorialHeading);
      setTreatEditorialSub(treat.editorialSub);
      setTreatDescription(treat.description);
      setTreatList(treat.treatments || []);
      
      showToast('Homepage configs reset to clinic defaults!');
    }
  };

  // Load all data on mount or when authorized
  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized]);

  const loadData = () => {
    setConsultations(getConsultations());
    setAppointments(getAppointments());
    setInquiries(getInquiries());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234') {
      setIsAuthorized(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid clinic administrator passcode');
    }
  };

  // Status coloring utility
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'contacted':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'booked':
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'reserved':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'completed':
        return 'bg-slate-100 text-slate-700 border border-slate-300';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  // Action Handlers
  const handleConsultationStatusChange = (id: string, status: ConsultationRequest['status']) => {
    const updated = updateConsultationStatus(id, status);
    setConsultations(updated);
    showToast(`Consultation status updated to ${status}`);
    if (selectedConsultation?.id === id) {
      setSelectedConsultation(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleConsultationNoteSave = (id: string, noteText?: string) => {
    const textToSave = noteText !== undefined ? noteText : internalNoteText;
    const updated = updateConsultationNotes(id, textToSave);
    setConsultations(updated);
    showToast('Internal note saved successfully');
    if (selectedConsultation?.id === id) {
      setSelectedConsultation(prev => prev ? { ...prev, internalNotes: textToSave } : null);
    }
  };

  const handleConsultationDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this consultation request?')) {
      const updated = deleteConsultation(id);
      setConsultations(updated);
      setSelectedConsultation(null);
      showToast('Consultation request deleted');
    }
  };

  const handleAppointmentStatusChange = (id: string, status: DoctorAppointmentRecord['status']) => {
    const updated = updateAppointmentStatus(id, status);
    setAppointments(updated);
    showToast(`Appointment status updated to ${status}`);
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleAppointmentNoteSave = (id: string, noteText?: string) => {
    const textToSave = noteText !== undefined ? noteText : internalNoteText;
    const updated = updateAppointmentNotes(id, textToSave);
    setAppointments(updated);
    showToast('Internal note saved successfully');
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, internalNotes: textToSave } : null);
    }
  };

  const handleAppointmentDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updated = deleteAppointment(id);
      setAppointments(updated);
      setSelectedAppointment(null);
      showToast('Doctor appointment deleted');
    }
  };

  const handleInquiryReadToggle = (id: string, currentRead: boolean) => {
    const updated = markInquiryAsRead(id, !currentRead);
    setInquiries(updated);
    showToast(`Inquiry marked as ${!currentRead ? 'read' : 'unread'}`);
  };

  const handleInquiryDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry message?')) {
      const updated = deleteInquiry(id);
      setInquiries(updated);
      showToast('Inquiry message deleted');
    }
  };

  const handleResetDb = () => {
    if (window.confirm('Are you sure you want to reset the admin database to initial sample records? This clears any new submissions.')) {
      resetAdminStoreToDefaults();
      loadData();
      showToast('Database reset to defaults successfully');
    }
  };

  const handleExportData = () => {
    const exportData = {
      consultations,
      appointments,
      inquiries,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `london-clinic-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('JSON export downloaded successfully');
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Helper parser for prices
  const parsePrice = (priceStr: string) => {
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Calculate stats
  const totalConsultationsWorth = consultations
    .filter(c => c.status !== 'cancelled')
    .reduce((sum, c) => sum + c.treatments.reduce((tsum, t) => tsum + parsePrice(t.price), 0), 0);

  const pendingConsultationsCount = consultations.filter(c => c.status === 'pending').length;
  const unreadInquiriesCount = inquiries.filter(i => !i.isRead).length;

  // Filtered consultations
  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.treatments.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && c.status === statusFilter;
  });

  // Filtered appointments
  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone.includes(searchTerm) ||
      a.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.services.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && a.status === statusFilter;
  });

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center"
        >
          {/* Logo Brand Header */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#003334] text-[#c5a880] rounded-2xl border border-[#c5a880]/20">
              <Lock className="h-8 w-8 animate-pulse" />
            </div>
          </div>

          <h2 className="font-serif font-bold text-2xl text-white tracking-tight">
            The London Clinic
          </h2>
          <p className="text-xs text-slate-400 font-sans tracking-widest uppercase mt-1 mb-6">
            Clinical Administration Portal
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Administrative Passcode
              </label>
              <input 
                type="password" 
                placeholder="Enter passcode (Hint: 1234)" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-center text-lg tracking-widest font-mono text-white focus:outline-none focus:border-[#c5a880] transition-colors"
              />
              {passcodeError && (
                <p className="text-xs text-rose-500 font-medium text-center mt-1">
                  {passcodeError}
                </p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-[#003334] hover:bg-[#236963] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg border border-[#c5a880]/30 cursor-pointer"
            >
              Authorize Secure Connection
            </button>
          </form>

          <button 
            onClick={onBackToClinic}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Public Clinic Site</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Toast Alert */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-[#003334] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[#c5a880]/40 text-xs font-bold"
          >
            <CheckCircle className="h-4 w-4 text-[#c5a880]" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE TOP BAR - visible on mobile only */}
      <header className="md:hidden bg-[#003334] text-white border-b border-[#c5a880]/20 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#c5a880]/20 rounded-lg text-[#c5a880]">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm tracking-tight text-white">Clinical Admin</h1>
            <p className="text-[9px] text-slate-300 font-sans tracking-wide -mt-0.5">v1.2 Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* LEFT SIDE NAV BAR - persistent on desktop, drawer on mobile */}
      <aside className={`
        group/sidebar overflow-hidden
        fixed inset-y-0 left-0 z-50 flex flex-col bg-[#003334] border-r border-[#c5a880]/15 text-white transform transition-all duration-300 ease-in-out
        w-72 md:w-20 hover:md:w-72
        md:translate-x-0 md:static md:h-screen md:sticky md:top-0 shrink-0
        ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile close button / Header area */}
        <div className="px-4 py-6 flex items-center justify-between border-b border-[#c5a880]/15">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#c5a880]/20 rounded-lg text-[#c5a880]">
              <Database className="h-5 w-5" />
            </div>
            <div className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <h2 className="font-serif font-bold text-base leading-tight tracking-tight text-white">
                The London Clinic
              </h2>
              <p className="text-[10px] text-[#c5a880] font-sans tracking-widest uppercase font-semibold">Admin Panel v1.2</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'consultations', label: 'Consultation Requests', count: consultations.length, icon: Users },
            { id: 'appointments', label: 'Faith Nzurike Slots', count: appointments.length, icon: Calendar },
            { id: 'inquiries', label: 'Clinic Inquiries', count: inquiries.length, icon: MessageSquare, badge: unreadInquiriesCount },
            { id: 'chat-support', label: 'Live Chat Support', icon: MessageSquare },
            { id: 'edit-service-details', label: 'Service Components Editor', icon: Layers },
            { id: 'edit-profile-details', label: 'Profile Page Details', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setStatusFilter('all');
                  setSearchTerm('');
                  setIsMobileNavOpen(false); // Close mobile sidebar on navigation
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 cursor-pointer text-left group ${
                  isActive 
                    ? 'bg-[#c5a880] text-[#003334] shadow-md shadow-[#003334]/20' 
                    : 'text-slate-300 hover:text-white hover:bg-[#c5a880]/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-[#003334]' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 whitespace-nowrap">{tab.label}</span>
                </div>
                {/* Count badge */}
                {tab.count !== undefined && (
                  <span className={`md:opacity-0 md:hidden group-hover/sidebar:md:inline-block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-[#003334]/15 text-[#003334]' : 'bg-white/10 text-slate-300'}`}>
                    {tab.count}
                  </span>
                )}
                {/* Unread badge */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="md:opacity-0 md:hidden group-hover/sidebar:md:inline-block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 bg-rose-500 text-white rounded-full text-[9px] px-1.5 py-0.5 font-bold font-mono animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Group: Homepage Editors Collapsible Accordion */}
          <div className="space-y-1">
            <button
              onClick={() => setIsHomepageEditorsOpen(!isHomepageEditorsOpen)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 cursor-pointer text-left group ${
                activeTab.startsWith('edit-')
                  ? 'bg-[#c5a880]/10 text-white border border-[#c5a880]/30 font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-[#c5a880]/10 font-bold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Edit className="h-4.5 w-4.5 shrink-0 text-slate-400 group-hover:text-white animate-none" />
                <span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 whitespace-nowrap">Homepage Editors</span>
              </div>
              <div className="flex items-center gap-2 md:opacity-0 md:hidden group-hover/sidebar:md:flex group-hover/sidebar:md:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#c5a880]/20 text-[#c5a880]">
                  19
                </span>
                {isHomepageEditorsOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isHomepageEditorsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="pl-3 ml-4 border-l border-[#c5a880]/20 space-y-1 overflow-hidden"
                >
                  {[
                    { id: 'edit-header', label: 'Header Branding', icon: Globe },
                    { id: 'edit-hero', label: 'Hero Presentation', icon: Image },
                    { id: 'edit-specialist', label: 'Specialist Areas', icon: Sparkles },
                    { id: 'edit-treatments', label: 'Treatments & Pricing', icon: FileText },
                    { id: 'edit-gallery', label: 'Before & After Gallery', icon: Image },
                    { id: 'edit-whychoose', label: 'Why Choose Us', icon: Heart },
                    { id: 'edit-awards', label: 'Awards & Honors', icon: Trophy },
                    { id: 'edit-locations', label: 'Our Locations', icon: MapPin },
                    { id: 'edit-team', label: 'Team Leadership', icon: Users },
                    { id: 'edit-process', label: 'Process', icon: ListOrdered },
                    { id: 'edit-facility', label: 'Facility Interiors', icon: Home },
                    { id: 'edit-testimonials', label: 'Testimonials', icon: MessageSquareQuote },
                    { id: 'edit-offers', label: 'Special Offers', icon: Tag },
                    { id: 'edit-skincare', label: 'Skincare Collection', icon: ShoppingBag },
                    { id: 'edit-trust', label: 'Trust Brands', icon: Shield },
                    { id: 'edit-accreditations', label: 'Accreditations', icon: Award },
                    { id: 'edit-news', label: 'Latest News', icon: Newspaper },
                    { id: 'edit-footer', label: 'Footer Info', icon: PanelBottom },
                    { id: 'edit-floating', label: 'Floating Menu', icon: MessageCircle }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setStatusFilter('all');
                          setSearchTerm('');
                          setIsMobileNavOpen(false); // Close mobile sidebar on navigation
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 cursor-pointer text-left group ${
                          isActive 
                            ? 'bg-[#c5a880] text-[#003334] shadow-sm' 
                            : 'text-slate-300 hover:text-white hover:bg-[#c5a880]/10'
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-[#003334]' : 'text-slate-400 group-hover:text-white'}`} />
                        <span className="truncate md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300">{tab.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {[
            { id: 'migration', label: 'Next.js Migration Spec', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setStatusFilter('all');
                  setSearchTerm('');
                  setIsMobileNavOpen(false); // Close mobile sidebar on navigation
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 cursor-pointer text-left group ${
                  isActive 
                    ? 'bg-[#c5a880] text-[#003334] shadow-md shadow-[#003334]/20' 
                    : 'text-slate-300 hover:text-white hover:bg-[#c5a880]/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-[#003334]' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 whitespace-nowrap">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-[#c5a880]/15 space-y-2 bg-[#05292a]">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-start px-4 gap-3 bg-[#c5a880]/10 hover:bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/25 py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer uppercase tracking-wider"
            title="Download full clinic data export"
          >
            <Download className="h-4.5 w-4.5 shrink-0" />
            <span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300">Export Database</span>
          </button>
          
          <button
            onClick={onBackToClinic}
            className="w-full flex items-center justify-start px-4 gap-3 bg-white text-[#003334] hover:bg-slate-100 py-2.5 rounded-xl text-[11px] font-extrabold transition-all shadow cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="h-4.5 w-4.5 shrink-0" />
            <span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300">Exit Admin Portal</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileNavOpen && (
        <div 
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50">
        
        {/* Top Header / Breadcrumb Bar on Desktop */}
        <header className="hidden md:block bg-white border-b border-slate-200 py-4 px-8 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#c5a880] font-mono">The London Clinic Administration</div>
              <h1 className="font-serif font-black text-xl text-[#003334] capitalize">
                {activeTab === 'overview' ? 'Dashboard Overview' : 
                 activeTab === 'consultations' ? 'Consultation Requests' : 
                 activeTab === 'appointments' ? 'Faith Nzurike Slots' : 
                 activeTab === 'inquiries' ? 'Clinic Inquiries' : 
                 activeTab === 'edit-header' ? 'Header Branding' : 
                 activeTab === 'edit-hero' ? 'Hero Presentation' : 
                 activeTab === 'edit-specialist' ? 'Specialist Areas' : 
                 activeTab === 'edit-treatments' ? 'Treatments & Pricing' : 
                 activeTab === 'edit-gallery' ? 'Before & After Gallery' : 
                 activeTab === 'edit-whychoose' ? 'Why Choose Us' : 
                 activeTab === 'edit-awards' ? 'Awards & Honors' : 
                 activeTab === 'edit-locations' ? 'Our Locations' :
                 activeTab === 'edit-team' ? 'Team Leadership' :
                 activeTab === 'edit-process' ? 'Process' :
                 activeTab === 'edit-facility' ? 'Facility Interiors' :
                 activeTab === 'edit-testimonials' ? 'Testimonials' :
                 activeTab === 'edit-offers' ? 'Special Offers' :
                 activeTab === 'edit-skincare' ? 'Skincare Collection' :
                 activeTab === 'edit-trust' ? 'Trust Brands' :
                 activeTab === 'edit-accreditations' ? 'Accreditations' :
                 activeTab === 'edit-news' ? 'Latest News' :
                 activeTab === 'edit-footer' ? 'Footer Info' :
                 activeTab === 'edit-floating' ? 'Floating Menu' : 
                 'Next.js Migration Spec'}
              </h1>
            </div>
            
            {/* Quick Status Pill & Homepage Editors Dropdown */}
            <div className="flex items-center gap-3 relative">
              {/* Homepage Editors Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                  className="flex items-center gap-2 bg-[#003334] hover:bg-[#236963] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer border border-[#c5a880]/30"
                >
                  <Edit className="h-4 w-4 text-[#c5a880]" />
                  <span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 whitespace-nowrap">Homepage Editors</span>
                  <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-200 ${isHeaderMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isHeaderMenuOpen && (
                    <>
                      {/* Fullscreen click-away overlay */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsHeaderMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-72 max-h-[420px] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-2.5 space-y-1"
                      >
                        <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                          <h4 className="font-serif font-black text-sm text-[#003334]">Homepage Modules</h4>
                          <p className="text-[10px] text-slate-500">Grouped quick-jump navigation links</p>
                        </div>
                        {[
                          { id: 'edit-header', label: 'Header Branding', icon: Globe },
                          { id: 'edit-hero', label: 'Hero Presentation', icon: Image },
                          { id: 'edit-specialist', label: 'Specialist Areas', icon: Sparkles },
                          { id: 'edit-treatments', label: 'Treatments & Pricing', icon: FileText },
                          { id: 'edit-gallery', label: 'Before & After Gallery', icon: Image },
                          { id: 'edit-whychoose', label: 'Why Choose Us', icon: Heart },
                          { id: 'edit-awards', label: 'Awards & Honors', icon: Trophy },
                          { id: 'edit-locations', label: 'Our Locations', icon: MapPin },
                          { id: 'edit-team', label: 'Team Leadership', icon: Users },
                          { id: 'edit-process', label: 'Process', icon: ListOrdered },
                          { id: 'edit-facility', label: 'Facility Interiors', icon: Home },
                          { id: 'edit-testimonials', label: 'Testimonials', icon: MessageSquareQuote },
                          { id: 'edit-offers', label: 'Special Offers', icon: Tag },
                          { id: 'edit-skincare', label: 'Skincare Collection', icon: ShoppingBag },
                          { id: 'edit-trust', label: 'Trust Brands', icon: Shield },
                          { id: 'edit-accreditations', label: 'Accreditations', icon: Award },
                          { id: 'edit-news', label: 'Latest News', icon: Newspaper },
                          { id: 'edit-footer', label: 'Footer Info', icon: PanelBottom },
                          { id: 'edit-floating', label: 'Floating Menu', icon: MessageCircle }
                        ].map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id as any);
                                setStatusFilter('all');
                                setSearchTerm('');
                                setIsHeaderMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                                isActive 
                                  ? 'bg-[#c5a880]/15 text-[#003334]' 
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#003334]'
                              }`}
                            >
                              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#003334]' : 'text-slate-400'}`} />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 bg-[#003334]/5 border border-[#003334]/10 rounded-full px-3 py-1 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider">Live Connection Stable</span>
              </div>
            </div>
          </div>
        </header>

        {/* Utility Stats / Environment Bar */}
        <div className="bg-[#0b3c3d] text-white text-[10px] uppercase tracking-wider font-semibold py-2 px-4 md:px-8 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3 font-mono">
            <span>Env: <strong className="text-white">React Client SPA</strong></span>
            <span>•</span>
            <span>Total Records: <strong className="text-[#c5a880]">{consultations.length + appointments.length + inquiries.length}</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[9px] bg-white/10 text-slate-200 px-2 py-0.5 rounded font-mono">UTC Sync</span>
          </div>
        </div>

        {/* Dynamic Inner Tab Content Container */}
        <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto">

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overview KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2.5 bg-[#003334]/5 text-[#003334] rounded-xl">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100">£ Clinical Value</span>
                </div>
                <h3 className="text-slate-400 font-sans text-xs uppercase tracking-wider font-extrabold">Estimated Pipeline</h3>
                <p className="font-serif font-bold text-2xl text-[#003334] mt-1">
                  £{totalConsultationsWorth.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Excludes cancelled plans</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2.5 bg-amber-500/5 text-amber-600 rounded-xl">
                    <Users className="h-5 w-5" />
                  </div>
                  {pendingConsultationsCount > 0 && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-100">
                      {pendingConsultationsCount} Action Required
                    </span>
                  )}
                </div>
                <h3 className="text-slate-400 font-sans text-xs uppercase tracking-wider font-extrabold">Consultation Queries</h3>
                <p className="font-serif font-bold text-2xl text-slate-800 mt-1">
                  {consultations.length} total
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {consultations.filter(c => c.status === 'booked').length} booked, {consultations.filter(c => c.status === 'contacted').length} contacted
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2.5 bg-purple-500/5 text-purple-600 rounded-xl">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold border border-purple-100">Dr. Faith Slotting</span>
                </div>
                <h3 className="text-slate-400 font-sans text-xs uppercase tracking-wider font-extrabold">Nzurike Appointments</h3>
                <p className="font-serif font-bold text-2xl text-slate-800 mt-1">
                  {appointments.length} active
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {appointments.filter(a => a.status === 'confirmed').length} confirmed, {appointments.filter(a => a.status === 'reserved').length} reserved
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2.5 bg-blue-500/5 text-blue-600 rounded-xl">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  {unreadInquiriesCount > 0 && (
                    <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-100 animate-pulse">
                      {unreadInquiriesCount} New Msg
                    </span>
                  )}
                </div>
                <h3 className="text-slate-400 font-sans text-xs uppercase tracking-wider font-extrabold">Hospital Inquiries</h3>
                <p className="font-serif font-bold text-2xl text-slate-800 mt-1">
                  {inquiries.length} inquiries
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {inquiries.filter(i => i.isRead).length} reviewed, {unreadInquiriesCount} unread
                </p>
              </div>
            </div>

            {/* NEW SECTION: HOMEPAGE CONTENT EDITORS GROUP */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <button 
                onClick={() => setIsHomepageEditorsOpen(!isHomepageEditorsOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
              >
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#003334] flex items-center gap-2">
                    <Edit className="h-5 w-5 text-[#c5a880]" />
                    <span>Homepage Editor Components</span>
                  </h3>
                  <p className="text-xs text-slate-500">Grouped panels to manage primary copy, pricing, galleries, and specialist profiles on the public front-end</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#003334]/5 text-[#003334]">
                    19 Sections
                  </span>
                  {isHomepageEditorsOpen ? (
                    <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-[#003334] transition-colors" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-[#003334] transition-colors" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isHomepageEditorsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden pt-4 border-t border-slate-100"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {[
                        { id: 'edit-header', label: 'Header Branding', icon: Globe },
                        { id: 'edit-hero', label: 'Hero Presentation', icon: Image },
                        { id: 'edit-specialist', label: 'Specialist Areas', icon: Sparkles },
                        { id: 'edit-treatments', label: 'Treatments & Pricing', icon: FileText },
                        { id: 'edit-gallery', label: 'Before & After Gallery', icon: Image },
                        { id: 'edit-whychoose', label: 'Why Choose Us', icon: Heart },
                        { id: 'edit-awards', label: 'Awards & Honors', icon: Trophy },
                        { id: 'edit-locations', label: 'Our Locations', icon: MapPin },
                        { id: 'edit-team', label: 'Team Leadership', icon: Users },
                        { id: 'edit-process', label: 'Process', icon: ListOrdered },
                        { id: 'edit-facility', label: 'Facility Interiors', icon: Home },
                        { id: 'edit-testimonials', label: 'Testimonials', icon: MessageSquareQuote },
                        { id: 'edit-offers', label: 'Special Offers', icon: Tag },
                        { id: 'edit-skincare', label: 'Skincare Collection', icon: ShoppingBag },
                        { id: 'edit-trust', label: 'Trust Brands', icon: Shield },
                        { id: 'edit-accreditations', label: 'Accreditations', icon: Award },
                        { id: 'edit-news', label: 'Latest News', icon: Newspaper },
                        { id: 'edit-footer', label: 'Footer Info', icon: PanelBottom },
                        { id: 'edit-floating', label: 'Floating Menu', icon: MessageCircle }
                      ].map((editor) => {
                        const Icon = editor.icon;
                        return (
                          <button
                            key={editor.id}
                            onClick={() => {
                              setActiveTab(editor.id as any);
                              setStatusFilter('all');
                              setSearchTerm('');
                              // Scroll up to ensure top header is visible
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200/80 hover:border-[#c5a880]/40 bg-slate-50/50 hover:bg-[#c5a880]/5 text-slate-700 hover:text-[#003334] transition-all duration-200 cursor-pointer group text-center space-y-2 h-24"
                          >
                            <Icon className="h-5 w-5 text-slate-400 group-hover:text-[#c5a880] group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold leading-tight truncate w-full">{editor.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Actions and Live Submissions Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Columns: Live Bookings Stream */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#003334]">Clinical Queue Overview</h3>
                    <p className="text-xs text-slate-500">Most recent consultation requests and appointments</p>
                  </div>
                  <button 
                    onClick={loadData}
                    className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-all"
                    title="Refresh data stream"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {consultations.length === 0 && appointments.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <Users className="h-10 w-10 mx-auto opacity-50" />
                      <p className="font-medium">No records found in current queue.</p>
                      <p className="text-xs">Submit a form on the public site or click "Seed Default Data" in Settings.</p>
                    </div>
                  ) : (
                    <>
                      {/* Merge and sort by date or mock index */}
                      {[
                        ...consultations.map(c => ({ ...c, recordType: 'consultation' as const })),
                        ...appointments.map(a => ({ ...a, recordType: 'appointment' as const }))
                      ]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5)
                        .map((item) => {
                          const isConsultation = item.recordType === 'consultation';
                          const name = isConsultation 
                            ? `${(item as any).firstName} ${(item as any).lastName}` 
                            : (item as any).name;
                          
                          const detailText = isConsultation
                            ? (item as any).treatments.map((t: any) => t.name).join(', ')
                            : (item as any).services.map((s: any) => s.name).join(', ');

                          const dateFormatted = new Date(item.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          });

                          return (
                            <div 
                              key={item.id}
                              className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#c5a880]/30 hover:bg-[#c5a880]/5 transition-all duration-200"
                            >
                              <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                                    isConsultation 
                                      ? 'bg-[#003334]/10 text-[#003334]' 
                                      : 'bg-purple-150 text-purple-800'
                                  }`}>
                                    {isConsultation ? 'Consultation Request' : 'Dr. Faith Appointment'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(item.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <h4 className="font-sans font-bold text-sm text-slate-800 truncate">
                                  {name}
                                </h4>
                                <p className="text-xs text-slate-500 truncate font-medium">
                                  {detailText}
                                </p>
                                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                  <span>Date: <strong className="text-slate-600">{dateFormatted}</strong></span>
                                  {!(isConsultation) && (
                                    <span>Time: <strong className="text-slate-600">{(item as any).time}</strong></span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2 shrink-0 pl-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(item.status)}`}>
                                  {item.status}
                                </span>
                                <button
                                  onClick={() => {
                                    if (isConsultation) {
                                      setSelectedConsultation(item as any);
                                      setInternalNoteText((item as any).internalNotes || '');
                                      setActiveTab('consultations');
                                    } else {
                                      setSelectedAppointment(item as any);
                                      setInternalNoteText((item as any).internalNotes || '');
                                      setActiveTab('appointments');
                                    }
                                  }}
                                  className="text-[11px] font-bold text-[#003334] hover:text-[#236963] inline-flex items-center gap-0.5"
                                >
                                  <span>Manage</span>
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Database Diagnostics & Quick Tools */}
              <div className="space-y-6">
                {/* Seed panel */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h4 className="font-serif font-bold text-[#003334]">Database Quick Tools</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Useful for reset testing, demonstration, or clinical data backup exports.
                  </p>
                  
                  <div className="pt-2 space-y-2.5">
                    <button
                      onClick={handleExportData}
                      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download JSON Database</span>
                    </button>
                    <button
                      onClick={handleResetDb}
                      className="w-full flex items-center justify-center gap-2 bg-[#c5a880]/15 hover:bg-[#c5a880]/25 text-[#003334] border border-[#c5a880]/30 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Seed Default Datasets</span>
                    </button>
                  </div>
                </div>

                {/* Patient Safety Standards */}
                <div className="bg-gradient-to-br from-[#003334] to-[#0c3e3f] text-white rounded-3xl p-6 shadow-md border border-[#c5a880]/20 space-y-3.5">
                  <div className="p-2.5 bg-white/10 text-[#c5a880] rounded-2xl w-fit">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#c5a880]">GDPR & Privacy Compliance</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      This system handles medical inquiry records, consultation notes, and private clinician diaries. Access logs are secured via administrators credentials.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono bg-black/20 p-2.5 rounded-xl border border-white/5 text-slate-300">
                    Local Sandbox storage securely formatted for easy migration.
                  </div>
                </div>

                {/* Admin Portal Pages Guide */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h4 className="font-serif font-bold text-base text-[#003334] flex items-center gap-2">
                    <Database className="h-4.5 w-4.5 text-[#c5a880]" />
                    <span>Administrative Pages Guide</span>
                  </h4>
                  <p className="text-xs text-slate-500">Quick reference regarding what each key management section displays and handles:</p>
                  
                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <h5 className="text-xs font-bold text-[#003334] flex items-center gap-1.5">
                        <LayoutDashboard className="h-3.5 w-3.5 text-[#c5a880]" />
                        <span>Dashboard Overview</span>
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        A real-time administrative cockpit providing an aggregated clinical queue, critical status alerts, estimated pipeline value, and easy database reset/seed/export operations.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <h5 className="text-xs font-bold text-[#003334] flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[#c5a880]" />
                        <span>Consultation Requests</span>
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        Manages incoming detailed cosmetic/medical treatment plans. Track treatment interests, medical history/concerns, and schedule contacted/booked follow-ups.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <h5 className="text-xs font-bold text-[#003334] flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#c5a880]" />
                        <span>Faith Nzurike Slots</span>
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        A dedicated specialist scheduling and calendar ledger. Approve or reschedule appointments, review patient services, and write internal notes regarding clinical slots.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <h5 className="text-xs font-bold text-[#003334] flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-[#c5a880]" />
                        <span>Clinic Inquiries</span>
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        A secure general message center for patients asking about clinic services, hours, or generic questions. Mark messages as reviewed/read or archive them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONSULTATION REQUESTS */}
        {activeTab === 'consultations' && (
          <ConsultationRequestsManager
            consultations={consultations}
            onStatusChange={handleConsultationStatusChange}
            onNoteSave={handleConsultationNoteSave}
            onDelete={handleConsultationDelete}
          />
        )}

        {/* TAB 3: DOCTOR APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <DoctorAppointmentsManager
            appointments={appointments}
            onStatusChange={handleAppointmentStatusChange}
            onNoteSave={handleAppointmentNoteSave}
            onDelete={handleAppointmentDelete}
          />
        )}

        {/* TAB 4: CLINIC INQUIRIES */}
        {activeTab === 'inquiries' && (
          <ClinicInquiriesManager
            inquiries={inquiries}
            onReadToggle={handleInquiryReadToggle}
            onDelete={handleInquiryDelete}
          />
        )}

        {/* TAB: CHAT SUPPORT */}
        {activeTab === 'chat-support' && <ChatSupportManager />}

        {/* TAB 5: NEXT.JS MIGRATION PLANNING SPEC */}
        {activeTab === 'migration' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3.5 bg-[#003334] text-[#c5a880] rounded-2xl">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#003334]">Next.js & Supabase Database Migration Spec</h3>
                  <p className="text-xs text-slate-500">Pre-engineering structure designed to decouple client-side state for future conversion</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <p>
                  You indicated that you intend to convert this application to a full-stack <strong className="text-slate-800">Next.js</strong> application with a persistent SQL backend database (such as <strong className="text-slate-800">Supabase</strong> or PostgreSQL) at a later date. To make that transition seamless, we have fully modularized the data store in <code className="bg-slate-100 p-1 rounded font-mono font-bold text-slate-700">/src/lib/adminStore.ts</code>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#003334] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Current Offline Engine
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      Saves records locally via <code className="font-mono bg-white px-1 py-0.5 rounded">localStorage</code> using decoupled state methods (<code className="font-mono text-xs text-slate-600">saveConsultation()</code>, <code className="font-mono text-xs text-slate-600">saveAppointment()</code>).
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] pl-1">
                      <li>Persistent across browser refreshes</li>
                      <li>Includes mock seed data generators</li>
                      <li>Fully functional status updating / note writing</li>
                    </ul>
                  </div>

                  <div className="bg-[#003334]/5 p-5 rounded-2xl border border-[#003334]/10 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#003334] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Next.js Migration Strategy
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      During Next.js conversion, you will simply replace the content of <code className="font-mono bg-white px-1 py-0.5 rounded">src/lib/adminStore.ts</code> with standard fetch or Prisma/Supabase Client functions.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] pl-1">
                      <li>Create database schema matching our typed structures</li>
                      <li>No modifications required inside front-end pages</li>
                      <li>Secure database credentials remain on the server-side</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-150 pt-5">
                  <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wider text-xs mb-3">
                    Supabase Database Setup Script (Prisma / SQL)
                  </h4>
                  <pre className="bg-slate-900 text-slate-300 font-mono text-[10px] p-5 rounded-2xl overflow-x-auto shadow-inner leading-normal">
{`-- SQL schema layout designed for immediate clinic injection

-- 1. Consultation Requests
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  appointment_date DATE NOT NULL,
  best_time VARCHAR(20) NOT NULL,
  hear_about_us VARCHAR(50),
  notes TEXT,
  improvement TEXT,
  doctor VARCHAR(50),
  stay_in_touch TEXT[] DEFAULT '{}',
  treatments JSONB DEFAULT '[]', -- Saves array of treatment objects
  status VARCHAR(20) DEFAULT 'pending', -- pending, contacted, booked, cancelled
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Doctor Appointments Slots
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(20) NOT NULL,
  service_key VARCHAR(50) NOT NULL,
  booking_ref VARCHAR(30) UNIQUE NOT NULL,
  services JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'reserved', -- reserved, confirmed, completed, cancelled
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Inquiries Inbox
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location VARCHAR(200) NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EDIT HEADER BRANDING */}
        {activeTab === 'edit-header' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#003334]">Header & Logo Branding</h3>
                  <p className="text-xs text-slate-500">Edit elements of the clinic header and logo identity. Changes apply immediately upon saving.</p>
                </div>
                <button
                  onClick={handleResetHomepage}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Restore Section Defaults</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Inputs */}
                <div className="md:col-span-2 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clinic Brand Name (Primary)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium animate-none"
                      value={hBrandName}
                      onChange={(e) => setHBrandName(e.target.value)}
                      placeholder="E.g., Age Reversal"
                    />
                    <p className="text-[10px] text-slate-400">The main bold name rendered in the top-left logo signature.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Branding Tagline (Secondary / Suffix)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium animate-none"
                      value={hTagline}
                      onChange={(e) => setHTagline(e.target.value)}
                      placeholder="E.g., Clinic"
                    />
                    <p className="text-[10px] text-slate-400">The smaller, widely-spaced text beneath or beside the primary brand name.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Header Logo Image URL</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-mono animate-none"
                      value={hLogoText}
                      onChange={(e) => setHLogoText(e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-[10px] text-slate-400">Provide an image URL for the clinic logo icon. It should be on a transparent or light background.</p>
                  </div>
                </div>

                {/* Real-time Preview Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Branding Live Preview</h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                      <img
                        src={hLogoText || "https://lh3.googleusercontent.com/aida-public/AB6AXuDesjN_a9T_c5ApVXtUbu_ZXToYSdPJkIyWoDOPkSuBoQRUyOhQp9l6Db9Wj4GBiuknLiRRmpxvA8iVUDtgyK1RWmkj17T-q0e-wv--cxohuK0XmXvrJN6DnkzK2gFmAprNxac_5EvIby0Pz6lyQGXQN8mXvvvWzRMdLtFeNDOnDO771chO4DAAYKRhLj_xguQkL4cWu1mf8hIz8RmRWNBhRLYOnOER31n5Ivd-7gbMKNxOExOBolE15qJO37x9C8cAZLSbx_RCy48Q"}
                        alt="Logo preview"
                        className="h-10 w-auto object-contain shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDesjN_a9T_c5ApVXtUbu_ZXToYSdPJkIyWoDOPkSuBoQRUyOhQp9l6Db9Wj4GBiuknLiRRmpxvA8iVUDtgyK1RWmkj17T-q0e-wv--cxohuK0XmXvrJN6DnkzK2gFmAprNxac_5EvIby0Pz6lyQGXQN8mXvvvWzRMdLtFeNDOnDO771chO4DAAYKRhLj_xguQkL4cWu1mf8hIz8RmRWNBhRLYOnOER31n5Ivd-7gbMKNxOExOBolE15qJO37x9C8cAZLSbx_RCy48Q";
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-900 leading-none">{hBrandName || "Age Reversal"}</span>
                        <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none mt-1">{hTagline || "Clinic"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 bg-[#003334]/5 border border-[#003334]/10 rounded-lg p-3">
                    <strong>Layout Guide:</strong> Logo images look best as transparent horizontal PNGs or SVGs with a height of around 48px.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row items-center sm:justify-end gap-4">
                <button
                  onClick={handleSaveHeader}
                  className="w-full sm:w-auto bg-[#003334] hover:bg-[#236963] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Save Header Branding</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EDIT HERO SECTION */}
        {activeTab === 'edit-hero' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#003334]">Hero Presentation</h3>
                  <p className="text-xs text-slate-500">Edit the welcome screen headline, badge accents, descriptions, and media background assets.</p>
                </div>
                <button
                  onClick={handleResetHomepage}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Restore Section Defaults</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Inputs */}
                <div className="md:col-span-2 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pill Badge Accent Text</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium animate-none"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      placeholder="E.g., Expert Care. Advanced Solutions."
                    />
                  </div>

                  <div className="space-y-2 animate-none">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Main Display Heading</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-serif font-semibold"
                      value={heroHeading}
                      onChange={(e) => setHeroHeading(e.target.value)}
                      placeholder="E.g., Exceptional Results with Age Reversal"
                    />
                    <p className="text-[10px] text-slate-400">Use standard line breaks if you want to control how the text wraps.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Description Body</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium"
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      placeholder="Introduce the clinical ethos..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Background Media Type</label>
                      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setHeroMediaType('video')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            heroMediaType === 'video' ? 'bg-[#003334] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Slow-Mo Video</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroMediaType('image')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            heroMediaType === 'image' ? 'bg-[#003334] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Image className="h-3.5 w-3.5" />
                          <span>Static Image</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Media URL Source</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-xs text-slate-800 font-mono"
                        value={heroMediaUrl}
                        onChange={(e) => setHeroMediaUrl(e.target.value)}
                        placeholder="Provide video file or image URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time Media Preview Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Background Asset Preview</h4>
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shadow-inner flex items-center justify-center">
                      {heroMediaType === 'image' ? (
                        <img
                          src={heroMediaUrl || "https://images.unsplash.com/photo-1579684389782-64d84b5e9053"}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1579684389782-64d84b5e9053";
                          }}
                        />
                      ) : (
                        <video
                          src={heroMediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-receiving-a-facial-treatment-40541-large.mp4"}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs">
                        {heroMediaType === 'video' ? 'Slow Video' : 'Image'}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 space-y-1">
                    <p><strong>Video requirements:</strong> Direct URL to an MP4 video (preferably muted, loopable, no sound track, under 10MB for fast load times).</p>
                    <p><strong>Image requirements:</strong> High-resolution landscape JPG/PNG, recommended ratio 16:10.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row items-center sm:justify-end gap-4">
                <button
                  onClick={handleSaveHero}
                  className="w-full sm:w-auto bg-[#003334] hover:bg-[#236963] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Save Hero Configuration</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EDIT SPECIALIST AREAS */}
        {activeTab === 'edit-specialist' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#003334]">Specialist Clinical Areas</h3>
                  <p className="text-xs text-slate-500">Edit the title, description, and list of clinical categories displayed on the public page.</p>
                </div>
                <button
                  onClick={handleResetHomepage}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Restore Section Defaults</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Explore Section Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium"
                    value={specHeading}
                    onChange={(e) => setSpecHeading(e.target.value)}
                    placeholder="E.g., Explore our specialist areas"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Explore Section Description</label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium"
                    value={specDescription}
                    onChange={(e) => setSpecDescription(e.target.value)}
                    placeholder="Introductory paragraph explaining specialty services..."
                  />
                </div>
              </div>

              {/* Dynamic list card items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-[#003334] uppercase tracking-widest">Active Specialist Area Cards ({specAreas.length})</h4>
                  <button
                    onClick={handleAddSpecArea}
                    className="inline-flex items-center gap-1 bg-[#003334] hover:bg-[#236963] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Specialty Card</span>
                  </button>
                </div>

                {specAreas.length === 0 ? (
                  <div className="bg-slate-50 text-slate-400 p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs">
                    No specialist clinical areas defined. Click "Add New Specialty Card" to add one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {specAreas.map((area, index) => (
                      <div key={area.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs relative group">
                        <button
                          onClick={() => handleDeleteSpecArea(index)}
                          className="absolute top-4 right-4 bg-rose-50 text-rose-600 hover:bg-rose-100 p-1.5 rounded-lg border border-rose-200 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
                          title="Delete Card"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex gap-4">
                          {/* Image box & input preview */}
                          <div className="w-24 h-24 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                            <img
                              src={area.image || "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c"}
                              alt="Card preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c";
                              }}
                            />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Card Title</label>
                              <input
                                type="text"
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#003334] text-xs font-bold text-slate-800 animate-none"
                                value={area.title}
                                onChange={(e) => handleUpdateSpecArea(index, 'title', e.target.value)}
                                placeholder="E.g., Eye Centre"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Card Image URL</label>
                              <input
                                type="text"
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#003334] text-[10px] font-mono text-slate-700 animate-none"
                                value={area.image}
                                onChange={(e) => handleUpdateSpecArea(index, 'image', e.target.value)}
                                placeholder="Card cover photo link..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Card Description Paragraph</label>
                          <textarea
                            rows={2}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#003334] text-xs text-slate-600 leading-relaxed"
                            value={area.description}
                            onChange={(e) => handleUpdateSpecArea(index, 'description', e.target.value)}
                            placeholder="Short summary describing services..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row items-center sm:justify-end gap-4">
                <button
                  onClick={handleSaveSpecialistAreas}
                  className="w-full sm:w-auto bg-[#003334] hover:bg-[#236963] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Save Specialist Areas Config</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EDIT TREATMENTS LIST */}
        {activeTab === 'edit-treatments' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#003334]">Treatments & Pricing</h3>
                  <p className="text-xs text-slate-500">Edit the editorial sub-text, treatments section descriptive copy, and individual services/prices listings.</p>
                </div>
                <button
                  onClick={handleResetHomepage}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Restore Section Defaults</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Editorial Background Label (Italicized)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-serif italic animate-none"
                    value={treatEditorialHeading}
                    onChange={(e) => setTreatEditorialHeading(e.target.value)}
                    placeholder="E.g., rejuvenation"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Editorial Action Subtitle</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium animate-none"
                    value={treatEditorialSub}
                    onChange={(e) => setTreatEditorialSub(e.target.value)}
                    placeholder="E.g., Begin your transformation"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Paragraph Description</label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium"
                    value={treatDescription}
                    onChange={(e) => setTreatDescription(e.target.value)}
                    placeholder="Describe therapeutic benefits or patient options..."
                  />
                </div>
              </div>

              {/* Dynamic list treatment offerings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-[#003334] uppercase tracking-widest">Active Treatment Offerings ({treatList.length})</h4>
                  <button
                    onClick={handleAddTreatmentItem}
                    className="inline-flex items-center gap-1 bg-[#003334] hover:bg-[#236963] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Treatment Item</span>
                  </button>
                </div>

                {treatList.length === 0 ? (
                  <div className="bg-slate-50 text-slate-400 p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs">
                    No treatments defined. Click "Add Treatment Item" to list a service.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-150">
                        <thead className="bg-slate-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Service Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest w-1/4">Starting Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest w-1/4">Duration Session</th>
                            <th scope="col" className="px-6 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest w-16">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {treatList.map((tr, index) => (
                            <tr key={tr.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-3 whitespace-nowrap">
                                <input
                                  type="text"
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#003334] text-xs font-semibold text-slate-800 animate-none"
                                  value={tr.name}
                                  onChange={(e) => handleUpdateTreatmentItem(index, 'name', e.target.value)}
                                  placeholder="E.g., HydraFacial Clinical"
                                />
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <input
                                  type="text"
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-600"
                                  value={tr.price || ''}
                                  onChange={(e) => handleUpdateTreatmentItem(index, 'price', e.target.value)}
                                  placeholder="E.g., £150"
                                />
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <input
                                  type="text"
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-600"
                                  value={tr.duration || ''}
                                  onChange={(e) => handleUpdateTreatmentItem(index, 'duration', e.target.value)}
                                  placeholder="E.g., 45 mins"
                                />
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTreatmentItem(index)}
                                  className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete Service"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row items-center sm:justify-end gap-4">
                <button
                  onClick={handleSaveTreatments}
                  className="w-full sm:w-auto bg-[#003334] hover:bg-[#236963] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Save Treatments Config</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EDIT BEFORE & AFTER GALLERY */}
        {activeTab === 'edit-gallery' && <GalleryEditor />}

        {/* TAB: EDIT WHY CHOOSE US */}
        {activeTab === 'edit-whychoose' && <WhyChooseUsEditor />}

        {/* TAB: EDIT AWARDS & RECOGNITION */}
        {activeTab === 'edit-awards' && <AwardsEditor />}

        {/* TAB: EDIT OUR LOCATIONS */}
        {activeTab === 'edit-locations' && <LocationsEditor />}
        {activeTab === 'edit-team' && <TeamLeadershipEditor />}
        {activeTab === 'edit-process' && <ProcessEditor />}
        {activeTab === 'edit-facility' && <FacilityInteriorsEditor />}
        {activeTab === 'edit-testimonials' && <TestimonialsEditor />}
        {activeTab === 'edit-offers' && <SpecialOffersEditor />}
        {activeTab === 'edit-skincare' && <SkincareCollectionEditor />}
        {activeTab === 'edit-trust' && <TrustBrandsEditor />}
        {activeTab === 'edit-accreditations' && <AccreditationsEditor />}
        {activeTab === 'edit-news' && <LatestNewsEditor />}
        {activeTab === 'edit-footer' && <FooterEditor />}
        {activeTab === 'edit-floating' && <FloatingMenuEditor />}

        {/* TAB: EDIT SERVICE VIEW DETAILS COMPONENTS */}
        {activeTab === 'edit-service-details' && <ServiceViewDetailsEditor />}
        {activeTab === 'edit-profile-details' && <ProfileDetailsEditor />}

      </main>
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
                  <div className="flex items-center gap-2">
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
                    {selectedConsultation.treatments.map(t => (
                      <div key={t.id} className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex items-center justify-between">
                        <span className="font-bold text-slate-800">{t.name}</span>
                        <span className="font-serif font-bold text-[#c5a880]">{t.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center px-2">
                      <span className="font-bold text-slate-800">Total Pipeline Value:</span>
                      <span className="font-serif font-bold text-base text-[#c5a880]">
                        £{selectedConsultation.treatments.reduce((sum, t) => sum + parsePrice(t.price), 0).toLocaleString()}
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
                    {selectedConsultation.stayInTouch.map(channel => (
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
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500">Update Status:</span>
                      <div className="flex gap-1 flex-wrap">
                        {['pending', 'contacted', 'booked', 'cancelled'].map(st => (
                          <button
                            key={st}
                            onClick={() => handleConsultationStatusChange(selectedConsultation.id, st as any)}
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
                      onClick={() => handleConsultationNoteSave(selectedConsultation.id)}
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
              <div className="bg-slate-900 text-white p-6 flex justify-between items-start shrink-0 border-b border-silver-850">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      Ref: {selectedAppointment.bookingRef}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Received: {new Date(selectedAppointment.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
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
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Patient Name</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedAppointment.name}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Patient Phone</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedAppointment.phone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Booked Date</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {new Date(selectedAppointment.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Slot Time</span>
                    <span className="text-sm font-semibold text-[#c5a880] uppercase tracking-wide font-sans">{selectedAppointment.time}</span>
                  </div>
                </div>

                {/* Specialty Services */}
                <div className="space-y-2">
                  <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wider text-[10px]">Requested Slot Procedures</h4>
                  <div className="space-y-2">
                    {selectedAppointment.services.map(s => (
                      <div key={s.id} className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex items-center justify-between">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="font-serif font-bold text-[#c5a880]">{s.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center px-2">
                      <span className="font-bold text-slate-800">Total Slot Value:</span>
                      <span className="font-serif font-bold text-base text-[#c5a880]">
                        £{selectedAppointment.services.reduce((sum, s) => sum + parsePrice(s.price), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Internal notes and workflow logging */}
                <div className="space-y-3.5 border-t border-slate-150 pt-4">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#003334] mb-1">Clinic Internal Records</h4>
                    <p className="text-[10px] text-slate-400">Log private notes or clinical feedback regarding this specific doctor appointment slot</p>
                  </div>
                  
                  <textarea
                    rows={2.5}
                    placeholder="Write clinical or reservation log notes..."
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#003334] focus:ring-1 focus:ring-[#003334] transition-colors"
                  />
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    {/* Status updater */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500">Update Status:</span>
                      <div className="flex gap-1 flex-wrap">
                        {['reserved', 'confirmed', 'completed', 'cancelled'].map(st => (
                          <button
                            key={st}
                            onClick={() => handleAppointmentStatusChange(selectedAppointment.id, st as any)}
                            className={`px-2 py-1 text-[10px] font-extrabold uppercase rounded border transition-colors cursor-pointer ${
                              selectedAppointment.status === st
                                ? 'bg-silver-900 border-silver-900 text-white shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAppointmentNoteSave(selectedAppointment.id)}
                      className="bg-[#c5a880] hover:bg-[#b0936b] text-[#003334] font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Save Diary Log Note
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
