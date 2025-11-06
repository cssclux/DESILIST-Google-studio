import React from 'react';
import { Link } from 'react-router-dom';
import type { Listing } from '../types';
import { XMarkIcon, MapPinIcon, CalendarDaysIcon } from './icons/Icons';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onContactSeller: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose, onContactSeller }) => {
  if (!listing) return null;

  const formattedDate = new Date(listing.postDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row animate-fade-in-down overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="w-full md:w-1/2">
            <img src={listing.imageUrl} alt={listing.title} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col relative overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 z-10">
                <XMarkIcon className="h-6 w-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{listing.title}</h2>
            
            <p className="text-primary dark:text-primary-dark font-extrabold text-4xl mb-4">{listing.price}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4 pb-4 border-b border-white/10 dark:border-slate-700/50">
                <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1.5" />
                    <span>{`${listing.location.city}, ${listing.location.state}`}</span>
                </div>
                <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 mr-1.5" />
                    <span>Posted on {formattedDate}</span>
                </div>
            </div>

            <div className="text-slate-600 dark:text-slate-300 space-y-4 mb-6 flex-grow">
                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Description</h3>
                <p>{listing.description}</p>
            </div>
            
            <div className="bg-slate-900/10 dark:bg-slate-700/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2">Seller Information</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Posted by:</strong>
                  <Link 
                    to={`/profile/${listing.seller.email}`} 
                    onClick={onClose}
                    className="ml-2 text-primary font-semibold hover:underline"
                  >
                     {listing.seller.name}
                  </Link>
                </p>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Click name to view profile and reviews.</p>
            </div>

            <div className="mt-6 text-center">
                <button 
                  onClick={onContactSeller}
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full w-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-px"
                >
                    Contact Seller
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};