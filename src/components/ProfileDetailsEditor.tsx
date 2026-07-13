"use client";

import React, { useState, useEffect } from 'react';
import { 
  getProfilePageConfig, 
  saveProfilePageConfig,
  DEFAULT_PROFILE_PAGE_CONFIG
} from '../lib/adminStore';
import { 
  ProfilePageConfig, 
  ProfileExpertiseItem, 
  ProfileMoreInfoSection, 
  ProfileReviewItem 
} from '../types';
import { 
  Check, 
  RefreshCw, 
  User, 
  Star, 
  Shield, 
  Award, 
  Activity, 
  Stethoscope, 
  ShieldCheck, 
  GraduationCap, 
  HeartPulse, 
  BookOpen, 
  Plus, 
  Trash2, 
  PlusCircle, 
  Image, 
  MessageSquare,
  Facebook,
  Instagram,
  Sparkles,
  Heart
} from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'Activity', label: 'Activity (Pulse)', icon: Activity },
  { value: 'Stethoscope', label: 'Stethoscope', icon: Stethoscope },
  { value: 'ShieldCheck', label: 'Shield Check', icon: ShieldCheck },
  { value: 'GraduationCap', label: 'Graduation Cap', icon: GraduationCap },
  { value: 'HeartPulse', label: 'Heart Pulse', icon: HeartPulse },
  { value: 'BookOpen', label: 'Book Open', icon: BookOpen },
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'User', label: 'User', icon: User },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'Heart', label: 'Heart', icon: Heart }
];

export default function ProfileDetailsEditor() {
  const [config, setConfig] = useState<ProfilePageConfig | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'hero-bio' | 'expertise' | 'more-info' | 'reviews'>('hero-bio');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setConfig(getProfilePageConfig());
  }, []);

  const handleSave = () => {
    if (!config) return;
    saveProfilePageConfig(config);
    setSaveSuccess(true);
    // Trigger custom event to notify preview of configuration updates
    window.dispatchEvent(new Event('profile-config-updated'));
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore default Consultant Profile page details?")) {
      saveProfilePageConfig(DEFAULT_PROFILE_PAGE_CONFIG);
      setConfig(DEFAULT_PROFILE_PAGE_CONFIG);
      setSaveSuccess(true);
      window.dispatchEvent(new Event('profile-config-updated'));
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!config) return null;

  // Paragraph handlers
  const handleParagraphChange = (idx: number, val: string) => {
    const updated = [...config.bioParagraphs];
    updated[idx] = val;
    setConfig({ ...config, bioParagraphs: updated });
  };

  const addParagraph = () => {
    setConfig({
      ...config,
      bioParagraphs: [...config.bioParagraphs, '']
    });
  };

  const removeParagraph = (idx: number) => {
    const updated = config.bioParagraphs.filter((_, i) => i !== idx);
    setConfig({ ...config, bioParagraphs: updated });
  };

  // Expertise handlers
  const handleExpertiseChange = (idx: number, field: keyof ProfileExpertiseItem, val: string) => {
    const updated = [...config.expertises];
    updated[idx] = { ...updated[idx], [field]: val };
    setConfig({ ...config, expertises: updated });
  };

  const addExpertiseItem = () => {
    const newItem: ProfileExpertiseItem = {
      title: 'New Expertise Focus',
      description: 'Describe the clinical approach and specialized outcomes.',
      iconName: 'Activity'
    };
    setConfig({
      ...config,
      expertises: [...config.expertises, newItem]
    });
  };

  const removeExpertiseItem = (idx: number) => {
    const updated = config.expertises.filter((_, i) => i !== idx);
    setConfig({ ...config, expertises: updated });
  };

  // More Info Section handlers
  const handleSectionTitleChange = (idx: number, val: string) => {
    const updated = [...config.moreInfoSections];
    updated[idx] = { ...updated[idx], title: val };
    setConfig({ ...config, moreInfoSections: updated });
  };

  const handleSectionIconChange = (idx: number, val: string) => {
    const updated = [...config.moreInfoSections];
    updated[idx] = { ...updated[idx], iconName: val };
    setConfig({ ...config, moreInfoSections: updated });
  };

  const handleSectionItemChange = (sectionIdx: number, itemIdx: number, val: string) => {
    const updated = [...config.moreInfoSections];
    const updatedItems = [...updated[sectionIdx].items];
    updatedItems[itemIdx] = val;
    updated[sectionIdx] = { ...updated[sectionIdx], items: updatedItems };
    setConfig({ ...config, moreInfoSections: updated });
  };

  const addSectionItem = (sectionIdx: number) => {
    const updated = [...config.moreInfoSections];
    const updatedItems = [...updated[sectionIdx].items, 'New detail point'];
    updated[sectionIdx] = { ...updated[sectionIdx], items: updatedItems };
    setConfig({ ...config, moreInfoSections: updated });
  };

  const removeSectionItem = (sectionIdx: number, itemIdx: number) => {
    const updated = [...config.moreInfoSections];
    const updatedItems = updated[sectionIdx].items.filter((_, i) => i !== itemIdx);
    updated[sectionIdx] = { ...updated[sectionIdx], items: updatedItems };
    setConfig({ ...config, moreInfoSections: updated });
  };

  const addMoreInfoSection = () => {
    const newSection: ProfileMoreInfoSection = {
      title: 'New Section Heading',
      iconName: 'Award',
      items: ['Detail point entry']
    };
    setConfig({
      ...config,
      moreInfoSections: [...config.moreInfoSections, newSection]
    });
  };

  const removeMoreInfoSection = (idx: number) => {
    const updated = config.moreInfoSections.filter((_, i) => i !== idx);
    setConfig({ ...config, moreInfoSections: updated });
  };

  // Review handlers
  const handleReviewChange = (idx: number, field: keyof ProfileReviewItem, val: any) => {
    const updated = [...config.reviews];
    updated[idx] = { ...updated[idx], [field]: val };
    setConfig({ ...config, reviews: updated });
  };

  const addReviewItem = () => {
    const newReview: ProfileReviewItem = {
      name: 'New Patient',
      role: 'Verified Recipient',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      date: 'June 2026',
      rating: 5,
      text: 'Describe the wonderful patient feedback or experience.',
      source: 'instagram'
    };
    setConfig({
      ...config,
      reviews: [...config.reviews, newReview]
    });
  };

  const removeReviewItem = (idx: number) => {
    const updated = config.reviews.filter((_, i) => i !== idx);
    setConfig({ ...config, reviews: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#003334] flex items-center gap-2">
              <User className="h-5 w-5 text-rose-gold" />
              <span>Consultant Profile Page Editor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize the biography, professional background, expertise focus points, credentials, and reviews for patient trust.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Restore Default Profile</span>
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
          <button
            type="button"
            onClick={() => setActiveSubTab('hero-bio')}
            className={`flex-1 min-w-[120px] px-4 py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'hero-bio' 
                ? 'bg-[#003334] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            Hero & Biography
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('expertise')}
            className={`flex-1 min-w-[120px] px-4 py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'expertise' 
                ? 'bg-[#003334] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            Clinical Expertise
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('more-info')}
            className={`flex-1 min-w-[120px] px-4 py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'more-info' 
                ? 'bg-[#003334] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            More Info Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('reviews')}
            className={`flex-1 min-w-[120px] px-4 py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'reviews' 
                ? 'bg-[#003334] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            Patient Reviews
          </button>
        </div>

        {/* Tab content area */}
        <div className="pt-2">
          {/* TAB 1: HERO & BIO */}
          {activeSubTab === 'hero-bio' && (
            <div className="space-y-6">
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <h4 className="text-sm font-bold text-[#003334] uppercase tracking-wider border-b border-slate-200 pb-2">Profile Hero Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Role Tag Label</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.roleTag}
                      onChange={(e) => setConfig({ ...config, roleTag: e.target.value })}
                      placeholder="e.g. Lead Consultant"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Specialty / Subtitle</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.specialtySubtitle}
                      onChange={(e) => setConfig({ ...config, specialtySubtitle: e.target.value })}
                      placeholder="e.g. Specialist in Regenerative Aesthetics"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Profile Photo URL</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                    value={config.photoUrl}
                    onChange={(e) => setConfig({ ...config, photoUrl: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Badge 1 (Experience)</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.experienceYears}
                      onChange={(e) => setConfig({ ...config, experienceYears: e.target.value })}
                      placeholder="e.g. 15+ Years Experience"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Badge 2 (GMC Status)</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.gmcStatus}
                      onChange={(e) => setConfig({ ...config, gmcStatus: e.target.value })}
                      placeholder="e.g. GMC Registered"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Badge 3 (Awards)</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.awardStatus}
                      onChange={(e) => setConfig({ ...config, awardStatus: e.target.value })}
                      placeholder="e.g. Award Winning"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <h4 className="text-sm font-bold text-[#003334] uppercase tracking-wider border-b border-slate-200 pb-2">Biography & Quotation</h4>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Biography Section Title</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                    value={config.bioTitle}
                    onChange={(e) => setConfig({ ...config, bioTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Biography Paragraphs</label>
                    <button
                      type="button"
                      onClick={addParagraph}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003334] hover:text-black"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {config.bioParagraphs.map((para, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="text-xs font-semibold text-slate-400 mt-3 font-mono shrink-0">#{idx + 1}</span>
                        <textarea
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800 resize-none"
                          value={para}
                          onChange={(e) => handleParagraphChange(idx, e.target.value)}
                          placeholder="Use {authorName} inside paragraph text to auto-substitute their name."
                        />
                        <button
                          type="button"
                          onClick={() => removeParagraph(idx)}
                          className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all border border-rose-100 cursor-pointer mt-1 shrink-0"
                          title="Remove paragraph"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Philosophy Quote (Callout block)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800 resize-none italic"
                    value={config.bioQuote}
                    onChange={(e) => setConfig({ ...config, bioQuote: e.target.value })}
                    placeholder="E.g., My philosophy centers on natural beauty..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLINICAL EXPERTISE */}
          {activeSubTab === 'expertise' && (
            <div className="space-y-6">
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <h4 className="text-sm font-bold text-[#003334] uppercase tracking-wider border-b border-slate-200 pb-2">Clinical Expertise Header</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expertise Title</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.expertiseTitle}
                      onChange={(e) => setConfig({ ...config, expertiseTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expertise Subtitle</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.expertiseSubtitle}
                      onChange={(e) => setConfig({ ...config, expertiseSubtitle: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-[#003334] text-base">Expertise Cards ({config.expertises.length})</h4>
                  <button
                    type="button"
                    onClick={addExpertiseItem}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-[#003334]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Expertise Focus</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {config.expertises.map((item, idx) => {
                    const selectedIconObj = ICON_OPTIONS.find(io => io.value === item.iconName) || ICON_OPTIONS[0];
                    const IconPreview = selectedIconObj.icon;

                    return (
                      <div key={idx} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-[9px] font-extrabold text-slate-400 font-mono tracking-wider">FOCUS #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeExpertiseItem(idx)}
                              className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-all border border-rose-100 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Title</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                              value={item.title}
                              onChange={(e) => handleExpertiseChange(idx, 'title', e.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Description</label>
                            <textarea
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800 resize-none"
                              value={item.description}
                              onChange={(e) => handleExpertiseChange(idx, 'description', e.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Select Icon</label>
                              <IconPreview className="h-4 w-4 text-[#33B4AA]" />
                            </div>
                            <select
                              className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 focus:ring-1 focus:ring-[#003334]"
                              value={item.iconName}
                              onChange={(e) => handleExpertiseChange(idx, 'iconName', e.target.value)}
                            >
                              {ICON_OPTIONS.map(io => (
                                <option key={io.value} value={io.value}>{io.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MORE INFO SECTIONS */}
          {activeSubTab === 'more-info' && (
            <div className="space-y-6">
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <h4 className="text-sm font-bold text-[#003334] uppercase tracking-wider border-b border-slate-200 pb-2">More Information Header</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Section Title</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                    value={config.moreInfoTitle}
                    onChange={(e) => setConfig({ ...config, moreInfoTitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-[#003334] text-base">Info Accordions / Blocks ({config.moreInfoSections.length})</h4>
                  <button
                    type="button"
                    onClick={addMoreInfoSection}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-[#003334]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Section</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {config.moreInfoSections.map((section, sIdx) => {
                    const selectedIconObj = ICON_OPTIONS.find(io => io.value === section.iconName) || ICON_OPTIONS[0];
                    const IconPreview = selectedIconObj.icon;

                    return (
                      <div key={sIdx} className="bg-slate-50/30 p-6 rounded-2xl border border-slate-200 space-y-4 relative hover:border-[#33B4AA]/40 transition-colors">
                        
                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-[9px] font-extrabold text-slate-400 font-mono tracking-wider">SECTION #{sIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeMoreInfoSection(sIdx)}
                            className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-all border border-rose-100 cursor-pointer"
                            title="Delete Section"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Title and Icon */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Title</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-semibold text-slate-800"
                              value={section.title}
                              onChange={(e) => handleSectionTitleChange(sIdx, e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Icon</label>
                              <IconPreview className="h-4 w-4 text-[#166488]" />
                            </div>
                            <select
                              className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 focus:ring-1 focus:ring-[#003334]"
                              value={section.iconName}
                              onChange={(e) => handleSectionIconChange(sIdx, e.target.value)}
                            >
                              {ICON_OPTIONS.map(io => (
                                <option key={io.value} value={io.value}>{io.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Sub items */}
                        <div className="space-y-2 pt-2 border-t border-slate-200/50">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Items / Accomplishments</label>
                            <button
                              type="button"
                              onClick={() => addSectionItem(sIdx)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#003334] hover:text-black cursor-pointer"
                            >
                              <PlusCircle className="h-3 w-3" />
                              <span>Add Line</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {section.items.map((item, iIdx) => (
                              <div key={iIdx} className="flex gap-2 items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#33B4AA] shrink-0" />
                                <input
                                  type="text"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs text-slate-700"
                                  value={item}
                                  onChange={(e) => handleSectionItemChange(sIdx, iIdx, e.target.value)}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(sIdx, iIdx)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PATIENT REVIEWS */}
          {activeSubTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <h4 className="text-sm font-bold text-[#003334] uppercase tracking-wider border-b border-slate-200 pb-2">Reviews Header Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Section Header Title</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.reviewsTitle}
                      onChange={(e) => setConfig({ ...config, reviewsTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Aggregate Rating (Stars)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.reviewsRating}
                      onChange={(e) => setConfig({ ...config, reviewsRating: parseFloat(e.target.value) || 5.0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reviews Count Text</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                      value={config.reviewsCountText}
                      onChange={(e) => setConfig({ ...config, reviewsCountText: e.target.value })}
                      placeholder="e.g. (124 verified reviews)"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-[#003334] text-base">Patient Reviews list ({config.reviews.length})</h4>
                  <button
                    type="button"
                    onClick={addReviewItem}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-[#003334]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Review</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {config.reviews.map((review, idx) => (
                    <div key={idx} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 relative grid grid-cols-1 md:grid-cols-12 gap-6 hover:border-slate-300 transition-colors">
                      
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          type="button"
                          onClick={() => removeReviewItem(idx)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all border border-rose-100 cursor-pointer flex items-center gap-1"
                          title="Delete Review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-bold px-1 font-sans">Delete</span>
                        </button>
                      </div>

                      {/* Left Block: Patient basics */}
                      <div className="md:col-span-4 space-y-3">
                        <span className="text-[10px] font-extrabold text-slate-400 font-mono tracking-wider block">REVIEW #{idx + 1}</span>
                        
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Patient Name</label>
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-semibold text-slate-800"
                            value={review.name}
                            onChange={(e) => handleReviewChange(idx, 'name', e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Patient Role / Status</label>
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                            value={review.role}
                            onChange={(e) => handleReviewChange(idx, 'role', e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Avatar Image URL</label>
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs text-slate-700"
                            value={review.image}
                            onChange={(e) => handleReviewChange(idx, 'image', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Right Block: Content & details */}
                      <div className="md:col-span-8 space-y-3 pr-20 md:pr-0">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Review Date</label>
                            <input
                              type="text"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                              value={review.date}
                              onChange={(e) => handleReviewChange(idx, 'date', e.target.value)}
                              placeholder="e.g. May 2026"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Rating (1-5)</label>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800"
                              value={review.rating}
                              onChange={(e) => handleReviewChange(idx, 'rating', parseInt(e.target.value) || 5)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Review Source</label>
                            <select
                              className="w-full bg-white px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 focus:ring-1 focus:ring-[#003334]"
                              value={review.source}
                              onChange={(e) => handleReviewChange(idx, 'source', e.target.value)}
                            >
                              <option value="instagram">Instagram</option>
                              <option value="facebook">Facebook</option>
                              <option value="tiktok">TikTok</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Review Content Text</label>
                          <textarea
                            rows={3}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#003334] text-xs font-medium text-slate-800 resize-none"
                            value={review.text}
                            onChange={(e) => handleReviewChange(idx, 'text', e.target.value)}
                            placeholder="An absolutely transformative experience..."
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons & Feedback Toast */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-150">
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#003334] hover:bg-black text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer font-sans"
          >
            <Check className="h-4 w-4" />
            <span>Save Profile Configuration</span>
          </button>

          {saveSuccess && (
            <span className="text-emerald-600 font-sans text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
              <Check className="h-4 w-4 stroke-[3px]" />
              <span>Profile details saved successfully! Refresh preview to view live updates.</span>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
