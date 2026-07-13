import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TREATMENT_DETAILS_DB, 
  TreatmentDetail,
  DEFAULT_TREATMENT_DETAILS
} from './treatments/treatmentData';
import { CLINICAL_AREAS_DB } from './LocationsAndConsultation';
import { 
  getTreatmentDetailsConfig, 
  saveTreatmentDetailsConfig 
} from '../lib/adminStore';
import { 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  ClipboardList, 
  AlertCircle, 
  Check, 
  FileText, 
  Clock, 
  Smile, 
  ShieldAlert, 
  Calendar,
  ChevronRight,
  ChevronDown,
  Database,
  Search,
  BookOpen,
  Sparkle,
  Activity,
  Heart,
  FolderHeart
} from 'lucide-react';

export default function ServiceViewDetailsEditor() {
  const [db, setDb] = useState<Record<string, TreatmentDetail>>({});
  const [selectedKey, setSelectedKey] = useState<string>('exosome');
  const [formData, setFormData] = useState<TreatmentDetail | null>(null);
  
  // Dynamic navigation search and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Custom service page creation modal/form state
  const [isCreating, setIsCreating] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState('$350');
  
  // Input for adding a single new additional image URL
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Tree expanded state
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({
    face: true,
    body: false,
    buttocks: false,
    'minor-surgery-scars': false,
    custom: true
  });

  const toggleArea = (areaId: string) => {
    setExpandedAreas(prev => ({ ...prev, [areaId]: !prev[areaId] }));
  };

  // Load database from adminStore / localStorage or default db
  useEffect(() => {
    const loaded = getTreatmentDetailsConfig();
    if (loaded) {
      // Ensure we fill in any missing treatments just in case
      const merged = { ...TREATMENT_DETAILS_DB, ...loaded };
      setDb(merged);
    } else {
      setDb(TREATMENT_DETAILS_DB);
    }
  }, []);

  // Update formData when selected treatment changes or db finishes loading
  useEffect(() => {
    if (db[selectedKey]) {
      const selectedData = JSON.parse(JSON.stringify(db[selectedKey]));
      // Ensure additionalImages exists as an array
      if (!selectedData.additionalImages) {
        selectedData.additionalImages = [];
      }
      setFormData(selectedData);
    } else {
      // Find item in CLINICAL_AREAS_DB to dynamically initialize missing keys
      let foundName = selectedKey;
      let foundCategory = 'General Practice';
      for (const area of CLINICAL_AREAS_DB) {
        for (const cat of area.categories) {
          const matchedItem = cat.items.find(item => item.id === selectedKey);
          if (matchedItem) {
            foundName = matchedItem.name;
            foundCategory = cat.name;
            break;
          }
        }
      }
      
      const defaultData = DEFAULT_TREATMENT_DETAILS(foundName);
      defaultData.id = selectedKey;
      defaultData.category = foundCategory;
      defaultData.additionalImages = [];
      setFormData(defaultData);
    }
  }, [selectedKey, db]);

  // Auto expand selected key's parent area
  useEffect(() => {
    // 1. Check in core database
    for (const area of CLINICAL_AREAS_DB) {
      for (const cat of area.categories) {
        if (cat.items.some(item => item.id === selectedKey)) {
          setExpandedAreas(prev => ({ ...prev, [area.id]: true }));
          return;
        }
      }
    }
    // 2. If it's a custom-added service, expand custom
    setExpandedAreas(prev => ({ ...prev, custom: true }));
  }, [selectedKey]);

  const handleFieldChange = (field: keyof TreatmentDetail, value: any) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // List editor helper functions (for preCare, postCare, concerns)
  const handleListElementChange = (field: 'preCare' | 'postCare' | 'concerns', index: number, value: string) => {
    if (!formData) return;
    const currentList = [...(formData[field] || [])];
    currentList[index] = value;
    handleFieldChange(field, currentList);
  };

  const addListElement = (field: 'preCare' | 'postCare' | 'concerns') => {
    if (!formData) return;
    const currentList = [...(formData[field] || [])];
    currentList.push('');
    handleFieldChange(field, currentList);
  };

  const removeListElement = (field: 'preCare' | 'postCare' | 'concerns', index: number) => {
    if (!formData) return;
    const currentList = [...(formData[field] || [])].filter((_, i) => i !== index);
    handleFieldChange(field, currentList);
  };

  // Additional Image Gallery handlers
  const handleAddAdditionalImage = () => {
    if (!formData || !newImageUrlInput.trim()) return;
    const currentImages = [...(formData.additionalImages || [])];
    currentImages.push(newImageUrlInput.trim());
    handleFieldChange('additionalImages', currentImages);
    setNewImageUrlInput('');
    setStatusMessage({ type: 'success', text: 'Added image URL to gallery queue. Click Save to persist changes!' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleRemoveAdditionalImage = (index: number) => {
    if (!formData) return;
    const currentImages = [...(formData.additionalImages || [])].filter((_, i) => i !== index);
    handleFieldChange('additionalImages', currentImages);
  };

  const handleUpdateAdditionalImage = (index: number, value: string) => {
    if (!formData) return;
    const currentImages = [...(formData.additionalImages || [])];
    currentImages[index] = value;
    handleFieldChange('additionalImages', currentImages);
  };

  // Save changes to active database
  const handleSave = () => {
    if (!formData) return;
    const updatedDb = {
      ...db,
      [selectedKey]: formData
    };
    setDb(updatedDb);
    saveTreatmentDetailsConfig(updatedDb);

    setStatusMessage({ type: 'success', text: `Successfully updated components & clinical parameters for ${formData.title}!` });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Reset selected treatment to defaults
  const handleResetSelected = () => {
    if (!window.confirm(`Are you sure you want to reset "${db[selectedKey]?.title || selectedKey}" clinical parameters back to factory defaults? This cannot be undone.`)) {
      return;
    }
    const defaultData = TREATMENT_DETAILS_DB[selectedKey];
    if (defaultData) {
      const updatedDb = {
        ...db,
        [selectedKey]: JSON.parse(JSON.stringify(defaultData))
      };
      setDb(updatedDb);
      saveTreatmentDetailsConfig(updatedDb);
      setStatusMessage({ type: 'success', text: `Restored ${defaultData.title} to standard clinic specifications.` });
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      // For custom items, just reset empty/template values
      const fallbackData = createDefaultService(selectedKey, db[selectedKey]?.title || 'Custom Service', db[selectedKey]?.category || 'General');
      const updatedDb = {
        ...db,
        [selectedKey]: fallbackData
      };
      setDb(updatedDb);
      saveTreatmentDetailsConfig(updatedDb);
      setStatusMessage({ type: 'success', text: `Reset custom service parameters to baseline templates.` });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Create default service helper
  const createDefaultService = (key: string, title: string, category: string): TreatmentDetail => ({
    id: key,
    title,
    category,
    description: 'Enter deep-dive clinical specifications, procedure methodologies, and patient support parameters for this custom service.',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
    badgeText: 'Advanced Clinical Procedure',
    procedureTime: '30 - 60 Minutes',
    comfortLevel: 'Mildly tolerable with topical numbing',
    downtime: '1 - 3 Days',
    recommendedSessions: '3 - 4 Sessions spaced 4-6 weeks apart',
    concerns: ['Skin texture irregular', 'Acne scars', 'Enlarged pores'],
    price: newPrice || '$350',
    targetLayer: 'Dermis',
    targetLayerDepth: '1.0mm - 2.0mm',
    beforeImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600',
    afterImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600',
    preCare: ['Avoid direct sun exposure for 72 hours.', 'Discontinue retinols 5 days before.'],
    postCare: ['Apply hydrating hyaluronic acid serum.', 'Wear broad-spectrum SPF 50+ daily.'],
    additionalImages: []
  });

  // Handle addition of a custom service template
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedKey = newKey.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    if (!formattedKey) {
      alert('Please enter a valid unique lookup identifier (alphanumeric only).');
      return;
    }
    if (db[formattedKey]) {
      alert(`A service with the key "${formattedKey}" already exists! Please choose a unique key.`);
      return;
    }
    if (!newTitle.trim()) {
      alert('Please enter a service page title.');
      return;
    }

    const newService = createDefaultService(formattedKey, newTitle.trim(), newCategory.trim() || 'General Practice');
    const updatedDb = {
      ...db,
      [formattedKey]: newService
    };

    setDb(updatedDb);
    saveTreatmentDetailsConfig(updatedDb);
    setSelectedKey(formattedKey);
    setIsCreating(false);

    // Reset fields
    setNewKey('');
    setNewTitle('');
    setNewCategory('');
    setNewPrice('$350');

    setStatusMessage({ type: 'success', text: `Successfully registered new Service Page details: ${newService.title}!` });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Delete a service page configuration
  const handleDeleteService = (key: string) => {
    if (!window.confirm(`Are you sure you want to completely delete the service page components for "${db[key]?.title || key}"? This cannot be undone.`)) {
      return;
    }
    const updatedDb = { ...db };
    delete updatedDb[key];
    setDb(updatedDb);
    saveTreatmentDetailsConfig(updatedDb);

    // Switch to another existing key
    const remainingKeys = Object.keys(updatedDb);
    if (remainingKeys.length > 0) {
      setSelectedKey(remainingKeys[0]);
    }

    setStatusMessage({ type: 'success', text: 'Service configuration deleted successfully.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Reset ALL treatments to default
  const handleResetAll = () => {
    if (!window.confirm('Reset ALL clinical service pages back to factory default? Any custom-written clinical guidelines, depths, and before/after URLs will be replaced with original templates.')) {
      return;
    }
    setDb(TREATMENT_DETAILS_DB);
    saveTreatmentDetailsConfig(TREATMENT_DETAILS_DB);
    setSelectedKey('exosome');
    setStatusMessage({ type: 'success', text: 'All clinical service templates successfully restored to default.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Identify core clinical area treatment IDs
  const coreTreatmentIds = React.useMemo(() => {
    const ids = new Set<string>();
    CLINICAL_AREAS_DB.forEach(area => {
      area.categories.forEach(cat => {
        cat.items.forEach(item => {
          ids.add(item.id);
        });
      });
    });
    return ids;
  }, []);

  // Determine any custom pages added by user that are not in CLINICAL_AREAS_DB
  const customServiceKeys = React.useMemo(() => {
    return Object.keys(db).filter(key => !coreTreatmentIds.has(key));
  }, [db, coreTreatmentIds]);

  if (!formData) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-slate-500 font-serif text-sm flex items-center gap-3 animate-pulse">
          <Database className="h-5 w-5 text-[#c5a880] shrink-0" />
          <span>Synchronizing clinical database registries...</span>
        </div>
      </div>
    );
  }

  // Generate dynamic service list directly from database state (adds dynamic additions in real-time)
  const availableServices = Object.keys(db).map(key => ({
    key,
    title: db[key]?.title || key,
    category: db[key]?.category || 'General Practice',
    id: db[key]?.id || key
  }));

  // Categories extracted dynamically from active database for filters
  const categories = ['all', ...Array.from(new Set(availableServices.map(s => s.category.trim()).filter(Boolean)))];

  // Filter service list dynamically in real-time based on search and category choice
  const filteredServices = availableServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-fadeIn" id="service-view-editor-root">
      
      {/* Upper Header Board */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#003334]/5 border border-[#003334]/10 rounded-3xl p-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#003334] flex items-center gap-2.5">
            <Layers className="h-5.5 w-5.5 text-[#c5a880] shrink-0" />
            <span>Service Page Components Editor</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Build and refine clinical content, scientific dermal targets, and visual portfolios displayed inside dynamic service deep-dives.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#003334] hover:bg-black rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 text-[#c5a880]" />
            <span>Add Custom Service Page</span>
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Reset database to standard factory state"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore All Defaults</span>
          </button>
        </div>
      </div>

      {/* Inline Form to Create a Custom Service */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateService} className="bg-white border border-[#c5a880]/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkle className="h-4.5 w-4.5 text-[#c5a880]" />
                <h4 className="text-sm font-serif font-bold text-[#003334]">Provision New Service Component Page</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Unique ID Key (lowercase, no spaces)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. microneedling"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 block">Treatment Name / Service Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Microneedling & RF Resurfacing"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Category Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Injectables"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#003334] hover:bg-black transition-all"
                >
                  Initialize Components Page
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {statusMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-center gap-3 border text-xs font-medium ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />}
          <span>{statusMessage.text}</span>
        </motion.div>
      )}

      {/* Workspace Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Dynamic Navigation Rails */}
        <div className="lg:col-span-1 space-y-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block px-1 mb-2">
              Select Core Service Page
            </span>
            
            {/* Real-time Dynamic Search bar */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334] bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Dynamic Category Filter pills - Only show when searching */}
            {searchTerm && (
              <div className="flex flex-wrap gap-1 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                      selectedCategory === cat 
                        ? 'bg-[#c5a880]/15 text-[#003334] border-[#c5a880]/40' 
                        : 'text-slate-500 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {cat === 'all' ? 'All categories' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Services Navigation Rail */}
          <div className="space-y-1 max-h-[550px] overflow-y-auto pr-1">
            {searchTerm ? (
              /* Flat list view for easy search filtering */
              <div className="space-y-1">
                {filteredServices.map((service) => (
                  <button
                    key={service.key}
                    type="button"
                    onClick={() => setSelectedKey(service.key)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition-all group ${
                      selectedKey === service.key 
                        ? 'bg-[#003334] text-white shadow-md shadow-[#003334]/10' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 max-w-[80%]">
                      <span className="text-xs font-bold leading-tight line-clamp-1">{service.title}</span>
                      <span className={`text-[9px] uppercase font-bold tracking-wider line-clamp-1 ${
                        selectedKey === service.key ? 'text-[#c5a880]' : 'text-slate-400'
                      }`}>{service.category}</span>
                    </div>
                    <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${
                      selectedKey === service.key ? 'text-[#c5a880] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5'
                    }`} />
                  </button>
                ))}

                {filteredServices.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-slate-400 italic">
                    No matching service pages.
                  </div>
                )}
              </div>
            ) : (
              /* Hierarchical Tree View aligned with clinical menu navigation mapping */
              <div className="space-y-2">
                {CLINICAL_AREAS_DB.map((area) => {
                  const isExpanded = !!expandedAreas[area.id];
                  return (
                    <div key={area.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/40">
                      <button
                        type="button"
                        onClick={() => toggleArea(area.id)}
                        className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                        <span className="text-[11px] font-extrabold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c5a880]" />
                          {area.name}
                        </span>
                        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-1.5 space-y-2.5 bg-white border-t border-slate-50">
                          {area.categories.map((cat) => (
                            <div key={cat.id} className="space-y-1">
                              <span className="text-[8.5px] font-extrabold tracking-widest text-slate-400 uppercase block px-2 py-0.5">
                                {cat.name}
                              </span>
                              
                              <div className="space-y-0.5 pl-1">
                                {cat.items.map((item) => {
                                  const isSelected = selectedKey === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setSelectedKey(item.id)}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[10.5px] transition-all flex items-center justify-between group ${
                                        isSelected 
                                          ? 'bg-[#003334] text-white font-bold shadow-sm shadow-[#003334]/15' 
                                          : 'hover:bg-slate-50 text-slate-600 hover:text-slate-950'
                                      }`}
                                    >
                                      <span className="truncate pr-1">{item.name}</span>
                                      <ChevronRight className={`h-2.5 w-2.5 shrink-0 transition-transform ${isSelected ? 'text-[#c5a880] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5'}`} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Custom Pages Group */}
                {customServiceKeys.length > 0 && (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/40">
                    <button
                      type="button"
                      onClick={() => toggleArea('custom')}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                    >
                      <span className="text-[11px] font-extrabold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Custom Pages
                      </span>
                      <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${expandedAreas.custom ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedAreas.custom && (
                      <div className="p-1.5 space-y-0.5 bg-white border-t border-slate-50">
                        {customServiceKeys.map((key) => {
                          const isSelected = selectedKey === key;
                          const title = db[key]?.title || key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setSelectedKey(key)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[10.5px] transition-all flex items-center justify-between group ${
                                isSelected 
                                  ? 'bg-[#003334] text-white font-bold shadow-sm shadow-[#003334]/15' 
                                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-950'
                              }`}
                            >
                              <span className="truncate pr-1">{title}</span>
                              <ChevronRight className={`h-2.5 w-2.5 shrink-0 transition-transform ${isSelected ? 'text-[#c5a880] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5'}`} />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Component Editor sections styled as dedicated separate containers */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header Dashboard section of selected service */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#c5a880] block mb-1">
                Active Component Workspace
              </span>
              <h4 className="text-lg font-serif font-bold text-[#003334]">{formData.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Database key reference: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-[#003334]">{formData.id}</code></p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Only show delete button if we have multiple services or custom pages */}
              {!TREATMENT_DETAILS_DB[selectedKey] && (
                <button
                  type="button"
                  onClick={() => handleDeleteService(selectedKey)}
                  className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-red-800 border border-red-150 hover:bg-red-50 bg-white rounded-xl flex items-center gap-1.5 transition-all"
                  title="Remove this custom service page entirely"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Custom Page</span>
                </button>
              )}
              
              <button
                type="button"
                onClick={handleResetSelected}
                className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white rounded-xl flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4.5 py-2 text-xs font-bold text-white bg-[#003334] hover:bg-[#c5a880] rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 hover:text-[#003334]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Components</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: HERO & BADGE COMPONENT CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2 border-b border-slate-150 pb-3">
              <Sparkles className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
              <span>1. Hero &amp; Badge Component Elements</span>
            </h5>
            <p className="text-[11px] text-slate-400 -mt-2">Customize the top headline banner, intro badges, pricing, and main backdrop of the service page.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Service Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. Exosome Regenerative Therapy"
                />
              </div>

              {/* Badge Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Introductory Badge Label</label>
                <input
                  type="text"
                  value={formData.badgeText || ''}
                  onChange={(e) => handleFieldChange('badgeText', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. Pioneering Biotech"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Category Classification</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. Regenerative Aesthetics"
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Starting Cost Indicator</label>
                <input
                  type="text"
                  value={formData.price || ''}
                  onChange={(e) => handleFieldChange('price', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. $650"
                />
              </div>

              {/* Hero Image */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 block">Hero Backdrop Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {formData.imageUrl && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Narrative description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 block">Detailed Scientific Narrative Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none leading-relaxed"
                  placeholder="Write the clinical summary regarding how this treatment revitalizes dermal cells..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: CLINICAL EXPECTATIONS COMPONENT CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2 border-b border-slate-150 pb-3">
              <Clock className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
              <span>2. Clinical Expectations &amp; Timeline Parameters</span>
            </h5>
            <p className="text-[11px] text-slate-400 -mt-2">Provide brief, high-level patient summaries regarding comfort levels, session spacing, and times.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Procedure Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Typical Procedure Time</label>
                <input
                  type="text"
                  value={formData.procedureTime}
                  onChange={(e) => handleFieldChange('procedureTime', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. 45 - 60 Minutes"
                />
              </div>

              {/* Comfort Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Patient Comfort Rating</label>
                <input
                  type="text"
                  value={formData.comfortLevel}
                  onChange={(e) => handleFieldChange('comfortLevel', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. Mildly Pinching (Topical Numbing Applied)"
                />
              </div>

              {/* Downtime */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Recovery / Skin Downtime</label>
                <input
                  type="text"
                  value={formData.downtime}
                  onChange={(e) => handleFieldChange('downtime', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. 12 - 24 Hours (Mild pink glow)"
                />
              </div>

              {/* Recommended Sessions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Optimal Sessions Protocol</label>
                <input
                  type="text"
                  value={formData.recommendedSessions}
                  onChange={(e) => handleFieldChange('recommendedSessions', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. 3 sessions spaced 4 weeks apart"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SKIN LAYER DEPTH ANALYSIS CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2 border-b border-slate-150 pb-3">
              <Activity className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
              <span>3. Scientific Skin Layer Targeting</span>
            </h5>
            <p className="text-[11px] text-slate-400 -mt-2">Define which cellular layer of the face and neck is biomechanically targeted during treatment.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Target Layer Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Focus Anatomical Layer</label>
                <select
                  value={formData.targetLayer}
                  onChange={(e) => handleFieldChange('targetLayer', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] bg-white outline-none"
                >
                  <option value="Epidermis">Epidermis (Surface Shield)</option>
                  <option value="Dermis">Dermis (Collagen &amp; Signaling Grid)</option>
                  <option value="Subdermal Adipose">Subdermal Adipose (Structural Fat Fibers)</option>
                  <option value="SMAS Muscle Layer">SMAS Muscle Layer (Surgical Foundational Lift)</option>
                </select>
              </div>

              {/* Target Depth */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Aesthetic Delivery Depth</label>
                <input
                  type="text"
                  value={formData.targetLayerDepth}
                  onChange={(e) => handleFieldChange('targetLayerDepth', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. 1.5mm - 4.5mm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: BEFORE & AFTER COMPARISON SLIDER IMAGES */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2 border-b border-slate-150 pb-3">
              <Smile className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
              <span>4. Clinical Before &amp; After Comparison Slider</span>
            </h5>
            <p className="text-[11px] text-slate-400 -mt-2">Provide visual outcomes demonstrating direct healing, firming, or volumization results.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Before image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Baseline (Before) Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.beforeImage}
                    onChange={(e) => handleFieldChange('beforeImage', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {formData.beforeImage && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={formData.beforeImage} alt="before" className="w-full h-full object-cover" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              </div>

              {/* After image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Outcome (After) Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.afterImage}
                    onChange={(e) => handleFieldChange('afterImage', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {formData.afterImage && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={formData.afterImage} alt="after" className="w-full h-full object-cover" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: CLINICAL GALLERY IMAGES WITH MULTIPLE ADDS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2 border-b border-slate-150 pb-3">
              <ImageIcon className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
              <span>5. Detailed Clinical Media Portfolio Gallery</span>
            </h5>
            <p className="text-[11px] text-slate-400 -mt-2">Dynamically append more microscopic, anatomical, or treatment session image URLs to the service detail page.</p>
            
            <div className="space-y-4 pt-1">
              {/* Image insertion tool */}
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
                <h6 className="text-[11px] font-extrabold text-[#003334] uppercase tracking-wider">Append New Reference Image</h6>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder="Paste unspash or host image URL here (e.g. https://images.unsplash.com/...)"
                    className="w-full px-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-sans bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddAdditionalImage}
                    className="px-4 py-2 bg-[#003334] hover:bg-[#c5a880] text-white hover:text-[#003334] text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Gallery</span>
                  </button>
                </div>
              </div>

              {/* Render existing images list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(formData.additionalImages || []).map((imgUrl, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-slate-200 p-3 rounded-2xl relative shadow-xs flex flex-col justify-between space-y-3 group"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                      <img 
                        src={imgUrl} 
                        alt={`Preview Reference #${index + 1}`} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => { 
                          (e.target as any).src = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800'; 
                        }} 
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-white/95 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-full border border-slate-150 transition-all shadow-sm"
                        title="Delete image URL"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    
                    {/* Editable image URL text box */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">REFERENCE DETAIL #{index + 1}</span>
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleUpdateAdditionalImage(index, e.target.value)}
                        className="w-full px-2.5 py-1 text-[10px] border border-slate-150 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none font-mono text-slate-500 bg-slate-50/50"
                      />
                    </div>
                  </div>
                ))}

                {(!formData.additionalImages || formData.additionalImages.length === 0) && (
                  <div className="sm:col-span-2 md:col-span-3 text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs italic">
                    No custom portfolio gallery images added yet. Append clean image URLs above.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 6: TARGET CONCERNS ARRAY COMPONENT */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2">
                <Heart className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
                <span>6. Dynamic Target Concerns / Indications</span>
              </h5>
              <button
                type="button"
                onClick={() => addListElement('concerns')}
                className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#003334] hover:bg-[#c5a880] hover:text-[#003334] rounded-lg flex items-center gap-1 transition-all shadow-sm"
              >
                <Plus className="h-3 w-3" />
                <span>Add Indication</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 -mt-2">Outline the direct visual skin concerns or laxities that this protocol biomechanically resolves.</p>
            
            <div className="space-y-2 pt-1">
              {formData.concerns.map((concern, index) => (
                <div key={index} className="flex gap-2 items-center animate-fadeIn">
                  <span className="text-[10px] font-mono text-slate-400 font-bold w-5">{index + 1}.</span>
                  <input
                    type="text"
                    value={concern}
                    onChange={(e) => handleListElementChange('concerns', index, e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none bg-white"
                    placeholder="e.g. Fine lines and superficial skin laxity"
                  />
                  <button
                    type="button"
                    onClick={() => removeListElement('concerns', index)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
              {formData.concerns.length === 0 && (
                <p className="text-[10px] text-slate-400 text-center italic py-2">No items listed. Click Add Indication to create one.</p>
              )}
            </div>
          </div>

          {/* SECTION 7: CLINICAL INSTRUCTIONS ARRAYS (PRE-CARE & POST-CARE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PRE-CARE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <h5 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
                  <span>Pre-Care Guidelines</span>
                </h5>
                <button
                  type="button"
                  onClick={() => addListElement('preCare')}
                  className="px-2.5 py-1 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1 transition-all border border-amber-200"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Line</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 -mt-2">What steps the patient must fulfill prior to session delivery.</p>

              <div className="space-y-2 pt-1">
                {formData.preCare.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-[10px] font-mono text-amber-700/60 font-bold w-5">{index + 1}.</span>
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => handleListElementChange('preCare', index, e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-amber-200/50 rounded-lg focus:ring-1 focus:ring-amber-500 outline-none bg-white text-slate-800"
                      placeholder="e.g. Avoid blood-thinners 5 days prior."
                    />
                    <button
                      type="button"
                      onClick={() => removeListElement('preCare', index)}
                      className="p-2 text-amber-600/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
                {formData.preCare.length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center italic py-2">No pre-care parameters defined.</p>
                )}
              </div>
            </div>

            {/* POST-CARE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <h5 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>Post-Care Recovery Protocols</span>
                </h5>
                <button
                  type="button"
                  onClick={() => addListElement('postCare')}
                  className="px-2.5 py-1 text-[10px] font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-all border border-emerald-200"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Line</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 -mt-2">Mandatory healing guidelines for patients to achieve secure dermal outcomes.</p>

              <div className="space-y-2 pt-1">
                {formData.postCare.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-[10px] font-mono text-emerald-700/60 font-bold w-5">{index + 1}.</span>
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => handleListElementChange('postCare', index, e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-emerald-200/50 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800"
                      placeholder="e.g. Wear mineral sunscreen (SPF 50+)."
                    />
                    <button
                      type="button"
                      onClick={() => removeListElement('postCare', index)}
                      className="p-2 text-emerald-600/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
                {formData.postCare.length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center italic py-2">No post-care guidelines defined.</p>
                )}
              </div>
            </div>

          </div>

          {/* Master bottom save panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <span className="text-xs text-slate-500 font-serif italic">Be sure to save your work before switching to another treatment.</span>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-3 text-xs font-bold text-white bg-[#003334] hover:bg-[#c5a880] rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:text-[#003334]"
            >
              <Save className="h-4 w-4 text-[#c5a880]" />
              <span>Save All Components Details</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
