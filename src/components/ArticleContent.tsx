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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-20">
        <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-luxury-subtext font-sans font-light">
          <p className="text-base sm:text-lg md:text-xl text-luxury-text font-serif italic mb-6 sm:mb-8 leading-relaxed">
            {article.description}
          </p>
          <p className="mb-5 sm:mb-6 leading-relaxed text-xs sm:text-sm md:text-base text-luxury-subtext">
            Every clinical procedure and patient pathway at The London Cosmetic Clinic begins with a thorough diagnostic assessment. We combine leading dermatological technology with tailored treatment protocols to achieve natural, refined, and lasting outcomes.
          </p>
          <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-luxury-text font-normal mt-8 sm:mt-10 mb-3 sm:mb-4">A Commitment to Clinical Excellence</h3>
          <p className="mb-5 sm:mb-6 leading-relaxed text-xs sm:text-sm md:text-base text-luxury-subtext">
            Our medical specialists utilize scientifically proven modalities, from bio-remodeling injectables to precision cellular renewal therapies. Each bespoke protocol honors individual facial harmony and anatomical integrity.
          </p>
          <blockquote className="border-l-2 border-luxury-gold pl-4 sm:pl-6 my-6 sm:my-8 italic text-sm sm:text-base md:text-lg text-luxury-text font-serif leading-relaxed bg-[#faf8f5] py-4 pr-4 rounded-r-xl">
            "Our primary focus is delivering exceptional aesthetic care through innovative treatments and a compassionate, doctor-led approach that sets the benchmark in medical aesthetics."
          </blockquote>
          <p className="mb-5 sm:mb-6 leading-relaxed text-xs sm:text-sm md:text-base text-luxury-subtext">
            Through ongoing research and collaboration with world-renowned aesthetic physicians, we continuously refine our minimally invasive techniques to ensure minimal downtime and maximum patient satisfaction.
          </p>
        </div>

        {/* Consultant Profile Item */}
        <ConsultantProfile authorName={article.author} onViewProfile={onViewProfile} />
      </div>
    </div>
  );
}
