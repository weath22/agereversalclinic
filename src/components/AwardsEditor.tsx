"use client";

import React, { useState, useEffect } from 'react';
import { 
  getAwardsConfig, 
  saveAwardsConfig,
  resetAdminStoreToDefaults
} from '../lib/adminStore';
import { AwardsConfig } from '../types';
import { 
  Check, 
  RefreshCw, 
  Trophy, 
  Star, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Award,
  Plus,
  Trash2
} from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'Trophy', label: 'Trophy', icon: Trophy },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'ShieldCheck', label: 'Shield Check', icon: ShieldCheck },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'Award', label: 'Award Badge', icon: Award }
];

export default function AwardsEditor() {
  const [config, setConfig] = useState<AwardsConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setConfig(getAwardsConfig());
  }, []);

  const handleSave = () => {
    if (!config) return;
    saveAwardsConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore default Awards settings?")) {
      resetAdminStoreToDefaults();
      setConfig(getAwardsConfig());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!config) return null;

  const addAward = () => {
    setConfig({
      ...config,
      awards: [
        ...config.awards,
        {
          id: 'award-' + Date.now(),
          title: 'New Clinical Award',
          organization: 'Medical Excellence Council',
          year: new Date().getFullYear().toString(),
          iconName: 'Trophy'
        }
      ]
    });
  };

  const deleteAward = (awardId: string) => {
    setConfig({
      ...config,
      awards: config.awards.filter(a => a.id !== awardId)
    });
  };

  const handleAwardFieldChange = (awardId: string, field: 'title' | 'organization' | 'year' | 'iconName', value: string) => {
    setConfig({
      ...config,
      awards: config.awards.map(a => 
        a.id === awardId ? { ...a, [field]: value } : a
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
              <Trophy className="h-5 w-5 text-rose-gold" />
              <span>Awards & Recognition Editor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize standard clinical badges, honors, and professional industry awards featured in the scrolling marquee.
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
              placeholder="E.g., Awards & Recognition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Section Description / Subheading
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium"
              value={config.subheading}
              onChange={(e) => setConfig({ ...config, subheading: e.target.value })}
              placeholder="E.g., Recognized internationally for premium standard in clinical trials and skincare treatments."
            />
          </div>
        </div>

        {/* Awards list */}
        <div className="space-y-6 pt-4 border-t border-slate-150">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-[#003334]">Honors list ({config.awards.length})</h4>
            <button
              onClick={addAward}
              className="inline-flex items-center gap-1 bg-[#003334] hover:bg-[#236963] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Honor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {config.awards.map((award, index) => {
              const selectedIconObj = ICON_OPTIONS.find(io => io.value === award.iconName) || ICON_OPTIONS[0];
              const IconComponent = selectedIconObj.icon;

              return (
                <div key={award.id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
                  <div>
                    {/* Header bar of card */}
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        Badge #{index + 1}
                      </span>
                      <button
                        onClick={() => deleteAward(award.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        title="Delete Award"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3.5">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block">Icon Option</label>
                          <select
                            className="w-full bg-white px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
                            value={award.iconName}
                            onChange={(e) => handleAwardFieldChange(award.id, 'iconName', e.target.value)}
                          >
                            {ICON_OPTIONS.map(io => (
                              <option key={io.value} value={io.value}>{io.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1 flex flex-col justify-end items-center">
                          <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <IconComponent className="h-5 w-5 text-[#003334]" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">Award Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                          value={award.title}
                          onChange={(e) => handleAwardFieldChange(award.id, 'title', e.target.value)}
                          placeholder="E.g., Dermatology Clinic of the Year"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block">Award Organization</label>
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600"
                            value={award.organization}
                            onChange={(e) => handleAwardFieldChange(award.id, 'organization', e.target.value)}
                            placeholder="E.g., Aesthetic Medicine Council"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block">Year</label>
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600"
                            value={award.year}
                            onChange={(e) => handleAwardFieldChange(award.id, 'year', e.target.value)}
                            placeholder="E.g., 2025"
                          />
                        </div>
                      </div>
                    </div>
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
                <span>Awards configuration saved successfully!</span>
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
