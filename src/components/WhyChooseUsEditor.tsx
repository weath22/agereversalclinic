"use client";

import React, { useState, useEffect } from 'react';
import { 
  getWhyChooseUsConfig, 
  saveWhyChooseUsConfig,
  resetAdminStoreToDefaults
} from '../lib/adminStore';
import { WhyChooseUsConfig } from '../types';
import { 
  Check, 
  RefreshCw, 
  ThumbsUp, 
  Building, 
  HeartPulse, 
  Medal, 
  Award, 
  Activity, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Trophy 
} from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'Building', label: 'Hospital Building', icon: Building },
  { value: 'ThumbsUp', label: 'Thumbs Up', icon: ThumbsUp },
  { value: 'HeartPulse', label: 'Heart Pulse', icon: HeartPulse },
  { value: 'Medal', label: 'Medal Icon', icon: Medal },
  { value: 'Award', label: 'Award Ribbon', icon: Award },
  { value: 'Activity', label: 'Heartbeat Activity', icon: Activity },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'ShieldCheck', label: 'Secure Shield', icon: ShieldCheck },
  { value: 'Sparkles', label: 'Magic Sparkles', icon: Sparkles },
  { value: 'Star', label: 'Star Rating', icon: Star },
  { value: 'Trophy', label: 'Champion Trophy', icon: Trophy }
];

export default function WhyChooseUsEditor() {
  const [config, setConfig] = useState<WhyChooseUsConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setConfig(getWhyChooseUsConfig());
  }, []);

  const handleSave = () => {
    if (!config) return;
    saveWhyChooseUsConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore default Why Choose Us settings?")) {
      resetAdminStoreToDefaults();
      setConfig(getWhyChooseUsConfig());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!config) return null;

  const handlePillarChange = (pillarId: string, field: 'title' | 'description' | 'iconName', value: string) => {
    setConfig({
      ...config,
      pillars: config.pillars.map(p => 
        p.id === pillarId ? { ...p, [field]: value } : p
      )
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#003334] flex items-center gap-2">
              <Building className="h-5 w-5 text-rose-gold" />
              <span>Why Choose Us Section Editor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Edit the core value propositions, credentials, and accolades displayed in the clinic's highlight section.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Restore Section Defaults</span>
          </button>
        </div>

        {/* Section Headings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Section Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium"
              value={config.heading}
              onChange={(e) => setConfig({ ...config, heading: e.target.value })}
              placeholder="E.g., Why choose The London Clinic?"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Section Subtitle
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium resize-none"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="E.g., Your health deserves the very best. Here's why patients trust our clinics..."
            />
          </div>
        </div>

        {/* Pillars / Core value points */}
        <div className="space-y-6 pt-4 border-t border-slate-150">
          <h4 className="font-serif font-bold text-base text-[#003334]">Value Proposition Pillars (4)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.pillars.map((pillar, index) => {
              // Get current icon component for preview
              const selectedIconObj = ICON_OPTIONS.find(io => io.value === pillar.iconName) || ICON_OPTIONS[0];
              const IconPreview = selectedIconObj.icon;

              return (
                <div key={pillar.id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 space-y-4 relative">
                  {/* Badge */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      Pillar #{index + 1} • {pillar.iconName}
                    </span>
                    <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <IconPreview className="h-4 w-4 text-[#003334]" />
                    </div>
                  </div>

                  {/* Icon selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Select Pillar Icon</label>
                    <select
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#003334]"
                      value={pillar.iconName}
                      onChange={(e) => handlePillarChange(pillar.id, 'iconName', e.target.value)}
                    >
                      {ICON_OPTIONS.map(io => (
                        <option key={io.value} value={io.value}>{io.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pillar Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                      value={pillar.title}
                      onChange={(e) => handlePillarChange(pillar.id, 'title', e.target.value)}
                      placeholder="E.g., UK's largest independent clinic"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pillar Description</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium resize-none"
                      value={pillar.description}
                      onChange={(e) => handlePillarChange(pillar.id, 'description', e.target.value)}
                      placeholder="Give a short detail supporting this pillar..."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                <span>Why Choose Us configuration saved successfully!</span>
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto bg-[#003334] hover:bg-[#236963] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            <span>Save Section Details</span>
          </button>
        </div>

      </div>
    </div>
  );
}
