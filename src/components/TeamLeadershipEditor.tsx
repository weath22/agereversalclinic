"use client";

import React, { useState, useEffect } from 'react';
import { 
  getTeamLeadershipConfig, 
  saveTeamLeadershipConfig,
  resetAdminStoreToDefaults
} from '../lib/adminStore';
import { TeamLeadershipConfig } from '../types';
import { 
  Check, 
  RefreshCw, 
  Users, 
  Plus, 
  Trash2
} from 'lucide-react';

export default function TeamLeadershipEditor() {
  const [config, setConfig] = useState<TeamLeadershipConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setConfig(getTeamLeadershipConfig());
  }, []);

  const handleSave = () => {
    if (!config) return;
    saveTeamLeadershipConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore default Team Leadership settings?")) {
      resetAdminStoreToDefaults();
      setConfig(getTeamLeadershipConfig());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!config) return null;

  const addMember = () => {
    setConfig({
      ...config,
      members: [
        ...config.members,
        {
          id: 'member-' + Date.now(),
          name: 'New Team Member',
          role: 'Specialist',
          description: 'Description of expertise',
          image: 'https://images.unsplash.com/photo-1612349317150-e410f624c4a5?w=400&h=400&fit=crop'
        }
      ]
    });
  };

  const deleteMember = (memberId: string) => {
    setConfig({
      ...config,
      members: config.members.filter(m => m.id !== memberId)
    });
  };

  const handleMemberFieldChange = (memberId: string, field: 'name' | 'role' | 'description' | 'image', value: string) => {
    setConfig({
      ...config,
      members: config.members.map(m => 
        m.id === memberId ? { ...m, [field]: value } : m
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
              <Users className="h-5 w-5 text-rose-gold" />
              <span>Team Leadership Editor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Manage the core clinical team members and specialists presented on the homepage.
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

        {/* Members list */}
        <div className="space-y-6 pt-4 border-t border-slate-150">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-[#003334]">Team Members ({config.members.length})</h4>
            <button
              onClick={addMember}
              className="inline-flex items-center gap-1 bg-[#003334] hover:bg-[#236963] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {config.members.map((member, index) => (
              <div key={member.id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Member #{index + 1}
                    </span>
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      title="Delete Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                        value={member.name}
                        onChange={(e) => handleMemberFieldChange(member.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Role</label>
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600"
                        value={member.role}
                        onChange={(e) => handleMemberFieldChange(member.id, 'role', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Description</label>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 resize-none"
                        value={member.description}
                        onChange={(e) => handleMemberFieldChange(member.id, 'description', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Image URL</label>
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-600"
                        value={member.image}
                        onChange={(e) => handleMemberFieldChange(member.id, 'image', e.target.value)}
                      />
                      <div className="aspect-[4/5] bg-slate-50 border border-slate-100 rounded overflow-hidden mt-1 max-h-[120px]">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
