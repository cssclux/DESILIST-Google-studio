import React from 'react';
import type { Listing } from '../types';
import { MapPinIcon, CalendarDaysIcon } from './icons/Icons';
import { CATEGORIES } from '../constants';

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return 'Today';
  if (diffDays <= 30) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const getCategoryDetails = (categoryId: string) => {
    const mainCategory = CATEGORIES.find(cat => cat.subcategories.some(sub => sub.id === categoryId));
    if (!mainCategory) return { color: 'bg-gray-500', name: 'General' };

    switch (mainCategory.id) {
        case 'community': return { color: 'bg-purple-500', name: mainCategory.name };
        case 'housing': return { color: 'bg-blue-500', name: mainCategory.name };
        case 'jobs': return { color: 'bg-green-500', name: mainCategory.name };
        case 'for-sale': return { color: 'bg-red-500', name: mainCategory.name };
        case 'services': return { color: 'bg-indigo-500', name: mainCategory.name };
        case 'gigs': return { color: 'bg-pink-500', name: mainCategory.name };
        default: return { color: 'bg-gray-500', name: 'General' };
    }
}


export const ListingCard: React.FC<ListingCardProps> = ({ listing, onViewDetails }) => {
  const formattedLocation = `${listing.location.city}, ${listing.location.state}`;
  const categoryDetails = getCategoryDetails(listing.category);

  return (
    <div onClick={() => onViewDetails(listing)} className="bg-white dark:bg-slate-800/20 dark:backdrop-blur-xl border border-slate-200 dark:border-slate-100/10 rounded-lg shadow-md dark:shadow-lg overflow-hidden hover:border-slate-300 dark:hover:border-slate-100/20 hover:shadow-lg dark:hover:bg-slate-800/30 transition-all duration-300 flex flex-col text-left w-full cursor-pointer group">
      <div className="relative">
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
        {listing.isFeatured && (
          <div className="absolute top-2 -right-10 text-center bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-900 font-semibold py-1 w-32 transform rotate-45 z-10 text-sm shadow-md">
            Featured
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white ${categoryDetails.color}`}>
                {categoryDetails.name}
            </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-secondary transition-colors duration-200 mb-2 h-14 overflow-hidden">{listing.title}</h3>
        <p className="text-teal-500 dark:text-teal-400 font-extrabold text-2xl mb-4">{listing.price}</p>
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-auto pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center truncate">
              <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0"/>
              <span title={`${listing.location.city}, ${listing.location.state}, ${listing.location.country}`} className="truncate">{formattedLocation}</span>
            </div>
            <div className="flex items-center flex-shrink-0">
              <CalendarDaysIcon className="h-4 w-4 mr-1.5"/>
              <span>{formatDate(listing.postDate)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};