import React from 'react';
import type { Listing } from '../types';
import { MapPinIcon, StarIcon, CalendarDaysIcon } from './icons/Icons';

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return 'Posted today';
  if (diffDays <= 30) return `Posted ${diffDays} days ago`;
  return `Posted on ${date.toLocaleDateString()}`;
};


export const ListingCard: React.FC<ListingCardProps> = ({ listing, onViewDetails }) => {
  const formattedLocation = `${listing.location.city}, ${listing.location.state}`;

  return (
    <button onClick={() => onViewDetails(listing)} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col text-left w-full">
      <div className="relative">
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-48 object-cover"/>
        {listing.isFeatured && (
          <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <StarIcon className="h-4 w-4 mr-1" />
            Featured
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold truncate mb-1 text-gray-800">{listing.title}</h3>
        <p className="text-primary font-bold text-xl mb-2">{listing.price}</p>
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <CalendarDaysIcon className="h-4 w-4 mr-1.5"/>
          <span>{formatDate(listing.postDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100">
          <MapPinIcon className="h-4 w-4 mr-1.5"/>
          <span title={`${listing.location.city}, ${listing.location.state}, ${listing.location.country}`} className="truncate">{formattedLocation}</span>
        </div>
      </div>
    </button>
  );
};