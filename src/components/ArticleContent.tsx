import React from 'react';
import { Article } from '../types';
import ConsultantProfile from './ConsultantProfile';

interface ArticleContentProps {
  article: Article;
  onViewProfile?: () => void;
}

export default function ArticleContent({ article, onViewProfile }: ArticleContentProps) {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20">
        <div className="prose prose-base sm:prose-lg md:prose-xl max-w-none text-luxury-text font-sans">
          <p className="text-lg sm:text-xl md:text-2xl text-luxury-text font-serif italic mb-8 sm:mb-10 leading-relaxed font-normal">
            {article.description}
          </p>
          <p className="mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg md:text-xl text-luxury-subtext font-light">
            Every clinical procedure and patient pathway at The London Cosmetic Clinic begins with a thorough diagnostic assessment. We combine leading dermatological technology with tailored treatment protocols to achieve natural, refined, and lasting outcomes.
          </p>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-luxury-text font-normal mt-10 sm:mt-14 mb-4 sm:mb-6">
            A Commitment to Clinical Excellence
          </h3>
          <p className="mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg md:text-xl text-luxury-subtext font-light">
            Our medical specialists utilize scientifically proven modalities, from bio-remodeling injectables to precision cellular renewal therapies. Each bespoke protocol honors individual facial harmony and anatomical integrity.
          </p>
          <blockquote className="border-l-4 border-luxury-gold pl-5 sm:pl-7 my-8 sm:my-10 italic text-base sm:text-lg md:text-xl text-luxury-text font-serif leading-relaxed bg-[#faf8f5] py-5 sm:py-6 pr-5 rounded-r-2xl">
            "Our primary focus is delivering exceptional aesthetic care through innovative treatments and a compassionate, doctor-led approach that sets the benchmark in medical aesthetics."
          </blockquote>
          <p className="mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg md:text-xl text-luxury-subtext font-light">
            Through ongoing research and collaboration with world-renowned aesthetic physicians, we continuously refine our minimally invasive techniques to ensure minimal downtime and maximum patient satisfaction.
          </p>
        </div>

        {/* Consultant Profile Item */}
        <ConsultantProfile authorName={article.author} onViewProfile={onViewProfile} />
      </div>
    </div>
  );
}
