"use client";

import React, { useState, useEffect } from 'react';
import { 
  getOurLocationsConfig, 
  saveOurLocationsConfig,
  resetAdminStoreToDefaults
} from '../lib/adminStore';
import { OurLocationsConfig } from '../types';
import { 
  Check, 
  RefreshCw, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Map, 
  Building2, 
  Plus, 
  Trash2,
  Image
} from 'lucide-react';

export default function LocationsEditor() {
  const [config, setConfig] = useState<OurLocationsConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setConfig(getOurLocationsConfig());
  }, []);

  const handleSave = () => {
    if (!config) return;
    saveOurLocationsConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore default Locations settings?")) {
      resetAdminStoreToDefaults();
      setConfig(getOurLocationsConfig());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!config) return null;

  const addLocation = () => {
    setConfig({
      ...config,
      locations: [
        ...config.locations,
        {
          id: 'loc-' + Date.now(),
          name: 'New Custom Consult Room',
          address: '100 Devonshire Place, London W1G 6BW',
          hours: 'Mon - Fri: 9:00 AM - 5:00 PM',
          mapsUrl: 'https://maps.google.com/?q=London',
          bannerType: 'Clinic',
          imageUrl: 'Diagnostic Consultation Suite'
        }
      ]
    });
  };

  const deleteLocation = (locId: string) => {
    setConfig({
      ...config,
      locations: config.locations.filter(l => l.id !== locId)
    });
  };

  const handleLocFieldChange = (locId: string, field: 'name' | 'address' | 'hours' | 'mapsUrl' | 'bannerType' | 'imageUrl', value: string) => {
    setConfig({
      ...config,
      locations: config.locations.map(l => 
        l.id === locId ? { ...l, [field]: value } : l
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
              <MapPin className="h-5 w-5 text-rose-gold" />
              <span>Locations Section Editor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Manage clinical headquarters, diagnostic branches, consulting room hours, and inquiry endpoints.
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
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Section Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium"
              value={config.heading}
              onChange={(e) => setConfig({ ...config, heading: e.target.value })}
              placeholder="E.g., Our Locations"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Section Description / Subheading
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium resize-none"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="E.g., Conveniently located in the heart of London's medical district, providing world-class care..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Background Banner Image URL (High Resolution overlay)
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-xs font-mono text-slate-700 resize-none"
              value={config.backgroundImage}
              onChange={(e) => setConfig({ ...config, backgroundImage: e.target.value })}
              placeholder="Enter custom image banner URL..."
            />
          </div>
        </div>

        {/* Locations list */}
        <div className="space-y-6 pt-4 border-t border-slate-150">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-[#003334]">Clinical Sites ({config.locations.length})</h4>
            <button
              onClick={addLocation}
              className="inline-flex items-center gap-1 bg-[#003334] hover:bg-[#236963] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Location</span>
            </button>
          </div>

          <div className="space-y-8">
            {config.locations.map((loc, index) => {
              return (
                <div key={loc.id} className="bg-slate-50/50 p-5 md:p-6 rounded-2xl border border-slate-200 space-y-5 relative">
                  
                  {/* Card Title & Delete button */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#003334] text-white font-mono text-[10px] font-bold">
                        {index + 1}
                      </span>
                      <h5 className="font-serif font-bold text-sm text-[#003334]">{loc.name || 'New Clinic'}</h5>
                    </div>
                    <button
                      onClick={() => deleteLocation(loc.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete Location"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Location / Building Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                        value={loc.name}
                        onChange={(e) => handleLocFieldChange(loc.id, 'name', e.target.value)}
                        placeholder="E.g., The London Clinic - Harley Street"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Map Icon Style</label>
                        <select
                          className="w-full bg-white px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
                          value={loc.bannerType}
                          onChange={(e) => handleLocFieldChange(loc.id, 'bannerType', e.target.value)}
                        >
                          <option value="Map">Interactive Map Icon</option>
                          <option value="Clinic">Building / Clinic Icon</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Image Label Text</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
                          value={loc.imageUrl}
                          onChange={(e) => handleLocFieldChange(loc.id, 'imageUrl', e.target.value)}
                          placeholder="E.g., Diagnostic Suite"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Address Details</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium"
                        value={loc.address}
                        onChange={(e) => handleLocFieldChange(loc.id, 'address', e.target.value)}
                        placeholder="E.g., 20 Devonshire Place, London W1G 6BW"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Consultation / Opening Hours</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium"
                        value={loc.hours}
                        onChange={(e) => handleLocFieldChange(loc.id, 'hours', e.target.value)}
                        placeholder="E.g., Mon - Fri: 8:00 AM - 8:00 PM"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Google Maps Coordinates / URL</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-600"
                        value={loc.mapsUrl}
                        onChange={(e) => handleLocFieldChange(loc.id, 'mapsUrl', e.target.value)}
                        placeholder="https://maps.google.com/?q=..."
                      />
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
                <span>Locations configuration saved successfully!</span>
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
