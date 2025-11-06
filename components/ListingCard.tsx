import React from 'react';
import type { Listing, User } from '../types';
import { MapPinIcon, CalendarDaysIcon, TrashIcon } from './icons/Icons';
import { CATEGORIES } from '../constants';

interface ListingCardProps {
  listing: Listing;
  currentUser: User | null;
  onViewDetails: (listing: Listing) => void;
  onDelete: (listingId: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffTime = now.getTime() - date.getTime();
  const diffSeconds = Math.round(diffTime / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return 'Today';
  }
  if (diffHours < 48 && date.getDate() === now.getDate() - 1) {
    return 'Yesterday';
  }
  if (diffDays <= 30) {
    return `${diffDays} days ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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


export const ListingCard: React.FC<ListingCardProps> = ({ listing, currentUser, onViewDetails, onDelete }) => {
  const formattedLocation = `${listing.location.city}, ${listing.location.state}`;
  const categoryDetails = getCategoryDetails(listing.category);
  const isOwner = currentUser && currentUser.email === listing.seller.email;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    onDelete(listing.id);
  };

  return (
    <div 
      onClick={() => onViewDetails(listing)} 
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left w-full cursor-pointer group border border-transparent dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary glow-on-hover"
    >
      {isOwner && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 z-20 p-1.5 bg-black/40 rounded-full text-white hover:bg-red-600/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Delete listing"
          title="Delete listing"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      )}
      <div className="relative overflow-hidden">
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"/>
        {listing.isFeatured && (
          <div className="absolute top-2 -right-10 text-center bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-900 font-semibold py-1 w-32 transform rotate-45 z-10 text-sm shadow-md">
            Featured
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white ${categoryDetails.color} self-start mb-2`}>
            {categoryDetails.name}
        </span>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors duration-200 mb-2 h-14 overflow-hidden">{listing.title}</h3>
        
        <p className="text-primary dark:text-primary-dark font-extrabold text-2xl mb-4">{listing.price}</p>
        
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