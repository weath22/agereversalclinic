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
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="prose prose-lg max-w-none text-[#3f4849] font-sans">
          <p className="text-xl md:text-2xl text-[#003334] font-medium mb-10 leading-relaxed">
            {article.description}
          </p>
          <p className="mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <h3 className="text-2xl font-serif text-[#003334] font-bold mt-12 mb-6">A Commitment to Excellence</h3>
          <p className="mb-6 leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
          </p>
          <blockquote className="border-l-4 border-[#236963] pl-6 my-10 italic text-xl md:text-2xl text-[#003334] font-serif leading-relaxed bg-[#f8f9ff] py-6 pr-6 rounded-r-xl">
            "Our primary focus has always been delivering exceptional patient care through innovative treatments and a compassionate approach that sets new standards in medical excellence."
          </blockquote>
          <p className="mb-6 leading-relaxed">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
        </div>

        {/* Consultant Profile Item */}
        <ConsultantProfile authorName={article.author} onViewProfile={onViewProfile} />
      </div>
    </div>
  );
}
