"use client";

import React, { useState, useEffect } from 'react';
import { 
  getAccreditationsConfig, 
  saveAccreditationsConfig,
  resetAdminStoreToDefaults
} from '../lib/adminStore';
import { AccreditationsConfig } from '../types';
import { 
  Check, 
  RefreshCw, 
  Award, 
  Plus, 
  Trash2
} from 'lucide-react';

export default function AccreditationsEditor() {
  const [config, setConfig] = useState<AccreditationsConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setConfig(getAccreditationsConfig());
  }, []);

  const handleSave = () => {
    if (!config) return;
    saveAccreditationsConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore default Accreditations settings?")) {
      resetAdminStoreToDefaults();
      setConfig(getAccreditationsConfig());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!config) return null;

  const addAccreditation = () => {
    setConfig({
      ...config,
      accreditations: [
        ...config.accreditations,
        {
          id: 'acc-' + Date.now(),
          text: 'New Accreditation'
        }
      ]
    });
  };

  const deleteAccreditation = (accId: string) => {
    setConfig({
      ...config,
      accreditations: config.accreditations.filter(a => a.id !== accId)
    });
  };

  const handleAccFieldChange = (accId: string, value: string) => {
    setConfig({
      ...config,
      accreditations: config.accreditations.map(a => 
        a.id === accId ? { ...a, text: value } : a
      )
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#003334] flex items-center gap-2">
              <Award className="h-5 w-5 text-rose-gold" />
              <span>Accreditations Editor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Manage the accreditation badges displayed on the homepage.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Restore Defaults</span>
          </button>
        </div>

        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-[#003334]">Accreditations ({config.accreditations.length})</h4>
            <button
              onClick={addAccreditation}
              className="inline-flex items-center gap-1 bg-[#003334] hover:bg-[#236963] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Accreditation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.accreditations.map((acc, index) => (
              <div key={acc.id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Accreditation #{index + 1}
                    </span>
                    <button
                      onClick={() => deleteAccreditation(acc.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      title="Delete Accreditation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Accreditation Text</label>
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                        value={acc.text}
                        onChange={(e) => handleAccFieldChange(acc.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                <span>Saved successfully!</span>
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
