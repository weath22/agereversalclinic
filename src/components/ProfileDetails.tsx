import React from 'react';
import { ProfilePageConfig } from '../types';

interface ProfileDetailsProps {
  authorName: string;
  config: ProfilePageConfig;
}

export default function ProfileDetails({ authorName, config }: ProfileDetailsProps) {
  const {
    bioTitle = 'Consultant Profile',
    bioParagraphs = [
      "{authorName} is a highly respected specialist at The London Clinic, bringing over 15 years of clinical expertise to our practice. With a foundational background in advanced dermatology and a profound focus on regenerative aesthetics, they have pioneered numerous protocols that combine cutting-edge science with holistic patient care.",
      "Graduating with honors from a top-tier medical institution, {authorName} completed comprehensive residency training before pursuing specialized fellowships in aesthetic medicine. Their approach is characterized by a meticulous attention to detail, ensuring that every treatment plan is deeply personalized to meet the unique physiological and aesthetic goals of the patient."
    ],
    bioQuote = '"My philosophy centers on enhancing natural beauty while restoring the skin\'s inherent health and vitality. I believe in utilizing advanced, evidence-based treatments to achieve subtle, durable, and highly impactful results for my patients."'
  } = config || {};

  // Helper to replace {authorName} placeholder
  const formatText = (text: string) => {
    return text.replace(/\{authorName\}/g, authorName);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-serif font-bold text-[#003334] mb-8">{bioTitle}</h2>
        <div className="prose prose-lg max-w-none text-[#3f4849] font-sans">
          {bioParagraphs.map((para, idx) => (
            <p key={idx} className="mb-6 leading-relaxed">
              {formatText(para)}
            </p>
          ))}
          {bioQuote && (
            <p className="leading-relaxed border-l-4 border-[#236963] pl-6 my-8 italic text-xl md:text-2xl text-[#003334] font-serif bg-[#f8f9ff] py-6 pr-6 rounded-r-xl">
              {formatText(bioQuote)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

