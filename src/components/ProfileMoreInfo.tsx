import React from 'react';
import * as Icons from 'lucide-react';
import { ProfilePageConfig } from '../types';

interface ProfileMoreInfoProps {
  config: ProfilePageConfig;
}

export default function ProfileMoreInfo({ config }: ProfileMoreInfoProps) {
  const {
    moreInfoTitle = 'More Information',
    moreInfoSections = []
  } = config || {};

  return (
    <section className="py-16 md:py-24 bg-white border-t border-[#33B4AA]/20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-serif font-bold text-[#166488] mb-12 text-center">{moreInfoTitle}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {moreInfoSections.map((section, idx) => {
            const IconComponent = (Icons as any)[section.iconName] || Icons.BookOpen;

            return (
              <div key={idx} className="bg-[#feebf3]/30 p-8 rounded-2xl shadow-sm border border-[#feebf3] hover:shadow-md transition-shadow hover:border-[#33B4AA]/30">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#166488]/10">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-[#feebf3]">
                    <IconComponent className="w-6 h-6 text-[#166488]" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#166488]">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-black/80 font-sans text-sm md:text-base">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#33B4AA] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

