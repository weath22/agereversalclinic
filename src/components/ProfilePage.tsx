import React, { useMemo } from 'react';
import ProfileHero from './ProfileHero';
import ProfileDetails from './ProfileDetails';
import ProfileClinicalExpertise from './ProfileClinicalExpertise';
import ProfileMoreInfo from './ProfileMoreInfo';
import ProfileReviews from './ProfileReviews';
import { getProfilePageConfig } from '../lib/adminStore';

interface ProfilePageProps {
  onClose: () => void;
  onBookClick: () => void;
  authorName: string;
}

export default function ProfilePage({ onClose, onBookClick, authorName }: ProfilePageProps) {
  const config = useMemo(() => getProfilePageConfig(), []);

  return (
    <div className="bg-white min-h-screen">
      <ProfileHero 
        authorName={authorName} 
        onClose={onClose} 
        onBookClick={onBookClick} 
        config={config} 
      />
      <ProfileDetails 
        authorName={authorName} 
        config={config} 
      />
      <ProfileClinicalExpertise 
        config={config} 
      />
      <ProfileMoreInfo 
        config={config} 
      />
      <ProfileReviews 
        config={config} 
      />
    </div>
  );
}

