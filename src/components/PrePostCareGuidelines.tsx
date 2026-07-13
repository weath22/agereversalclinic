import { useState } from 'react';
import { Calendar, ShieldAlert, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PrePostCareGuidelinesProps {
  preCare: string[];
  postCare: string[];
  treatmentName: string;
}

export default function PrePostCareGuidelines({ preCare, postCare, treatmentName }: PrePostCareGuidelinesProps) {
  const [activeTab, setActiveTab] = useState<'pre' | 'post'>('pre');

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-rose-gold block">
          Clinical Guidance
        </span>
        <h4 className="text-lg font-serif font-bold text-silver-950 flex items-center gap-1.5">
          <Calendar className="h-4.5 w-4.5 text-rose-gold" />
          <span>Care Guidelines</span>
        </h4>
      </div>

      {/* Tab Controls with split layout */}
      <div className="bg-white border border-silver-150 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left / Top Side: Text & Checklists */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="flex bg-silver-50 rounded-lg p-1.5 border border-silver-100">
              <button
                onClick={() => setActiveTab('pre')}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  activeTab === 'pre'
                    ? 'bg-[#003334] text-white shadow-sm'
                    : 'text-silver-500 hover:text-black'
                }`}
              >
                Clinical Pre-Care
              </button>
              <button
                onClick={() => setActiveTab('post')}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  activeTab === 'post'
                    ? 'bg-[#003334] text-white shadow-sm'
                    : 'text-silver-500 hover:text-black'
                }`}
              >
                Restorative Post-Care
              </button>
            </div>

            {/* Tab Content Display */}
            <div className="relative min-h-[220px] flex-1">
              <AnimatePresence mode="wait">
                {activeTab === 'pre' ? (
                  <motion.div
                    key="pre-care-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-3 bg-rose-50/50 border border-rose-100/50 rounded-xl p-3.5 mb-2">
                      <ShieldAlert className="h-5 w-5 text-rose-700 shrink-0 mt-0.5" />
                      <p className="text-[11px] md:text-xs text-rose-950 font-medium leading-relaxed">
                        <span className="font-bold">Important Prep Checklist:</span> Adhering strictly to these guidelines reduces risk of minor capillary bruising and optimizes cellular acceptance of active skin protocols.
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      {preCare.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-1 rounded-md">
                          <div className="p-1 bg-green-50 rounded text-green-700 mt-0.5">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className="text-xs md:text-sm text-silver-700 leading-normal font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="post-care-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-3 bg-amber-50/50 border border-amber-100/50 rounded-xl p-3.5 mb-2">
                      <Sparkles className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                      <p className="text-[11px] md:text-xs text-amber-950 font-medium leading-relaxed">
                        <span className="font-bold">Aftercare Notice:</span> Skin regeneration is a progressive cellular process. Protect the treated epidermal matrix carefully to guarantee maximum lifespan and clinical results.
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      {postCare.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-1 rounded-md">
                          <div className="p-1 bg-amber-50 rounded text-amber-700 mt-0.5">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                          <span className="text-xs md:text-sm text-silver-700 leading-normal font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right / Bottom Side: Gorgeous Dynamic Visuals with Smooth Cross-fades */}
          <div className="md:col-span-5 relative rounded-xl overflow-hidden min-h-[240px] md:min-h-full flex flex-col group bg-silver-100 border border-silver-150">
            <AnimatePresence mode="wait">
              {activeTab === 'pre' ? (
                <motion.div
                  key="pre-visual"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww"
                    alt="Clinical Skin Prep Serum Application"
                    className="w-full h-full object-cover brightness-[0.93] group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 inset-x-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-gold block mb-0.5">Clinical Protocol</span>
                    <h5 className="text-white text-xs font-bold leading-tight">Epidermal Prime & Hydration</h5>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="post-visual"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r"
                    alt="Clinical Recovery Spa Sanctuary"
                    className="w-full h-full object-cover brightness-[0.93] group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 inset-x-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-gold block mb-0.5">Post-Care Ritual</span>
                    <h5 className="text-white text-xs font-bold leading-tight">Cellular Healing & Protection</h5>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
