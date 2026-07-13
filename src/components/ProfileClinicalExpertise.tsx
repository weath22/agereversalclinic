import React from 'react';
import * as Icons from 'lucide-react';
import { ProfilePageConfig } from '../types';

interface ProfileClinicalExpertiseProps {
  config: ProfilePageConfig;
}

export default function ProfileClinicalExpertise({ config }: ProfileClinicalExpertiseProps) {
  const {
    expertiseTitle = 'Clinical Expertise',
    expertiseSubtitle = 'Pioneering advanced, evidence-based therapies for transformative results.',
    expertises = []
  } = config || {};

  return (
    <section className="py-16 md:py-24 bg-[#F3FBEF] border-t border-[#7ECF91]/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#feebf3] rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7ECF91] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-[#166488] mb-4">{expertiseTitle}</h2>
          {expertiseSubtitle && (
            <p className="text-black/70 font-sans max-w-2xl mx-auto leading-relaxed">
              {expertiseSubtitle}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertises.map((item, idx) => {
            // Dynamically resolve the icon
            const IconComponent = (Icons as any)[item.iconName] || Icons.Activity;
            
            return (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-[#33B4AA]/20 text-center flex flex-col items-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F3FBEF] to-[#7ECF91]/20 flex items-center justify-center shadow-sm mb-6">
                  <IconComponent className="w-6 h-6 text-[#33B4AA]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#166488] mb-3">{item.title}</h3>
                <p className="text-black/80 font-sans text-sm md:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

