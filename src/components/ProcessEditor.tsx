"use client";

import React, { useState, useEffect } from 'react';
import { 
  getProcessConfig, 
  saveProcessConfig,
  resetAdminStoreToDefaults
} from '../lib/adminStore';
import { ProcessConfig } from '../types';
import { 
  Check, 
  RefreshCw, 
  ListOrdered, 
  Plus, 
  Trash2
} from 'lucide-react';

export default function ProcessEditor() {
  const [config, setConfig] = useState<ProcessConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setConfig(getProcessConfig());
  }, []);

  const handleSave = () => {
    if (!config) return;
    saveProcessConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore default Process settings?")) {
      resetAdminStoreToDefaults();
      setConfig(getProcessConfig());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!config) return null;

  const addStep = () => {
    setConfig({
      ...config,
      steps: [
        ...config.steps,
        {
          id: 'step-' + Date.now(),
          stepNumber: `0${config.steps.length + 1}`,
          title: 'New Process Step',
          image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=400&fit=crop'
        }
      ]
    });
  };

  const deleteStep = (stepId: string) => {
    setConfig({
      ...config,
      steps: config.steps.filter(s => s.id !== stepId)
    });
  };

  const handleStepFieldChange = (stepId: string, field: 'stepNumber' | 'title' | 'image', value: string) => {
    setConfig({
      ...config,
      steps: config.steps.map(s => 
        s.id === stepId ? { ...s, [field]: value } : s
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
              <ListOrdered className="h-5 w-5 text-rose-gold" />
              <span>Process Editor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Manage the steps of the patient journey presented on the homepage.
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
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Section Description
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium resize-none"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="space-y-6 pt-4 border-t border-slate-150">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-[#003334]">Process Steps ({config.steps.length})</h4>
            <button
              onClick={addStep}
              className="inline-flex items-center gap-1 bg-[#003334] hover:bg-[#236963] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {config.steps.map((step, index) => (
              <div key={step.id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Step #{index + 1}
                    </span>
                    <button
                      onClick={() => deleteStep(step.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      title="Delete Step"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Step Number</label>
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                        value={step.stepNumber}
                        onChange={(e) => handleStepFieldChange(step.id, 'stepNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600"
                        value={step.title}
                        onChange={(e) => handleStepFieldChange(step.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Image URL</label>
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-600"
                        value={step.image}
                        onChange={(e) => handleStepFieldChange(step.id, 'image', e.target.value)}
                      />
                      <div className="aspect-[4/3] bg-slate-50 border border-slate-100 rounded overflow-hidden mt-1 max-h-[120px]">
                        <img src={step.image} alt={step.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
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
