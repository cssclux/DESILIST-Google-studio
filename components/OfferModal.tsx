import React, { useState } from 'react';
import type { Listing } from '../types';
import { XMarkIcon } from './icons/Icons';

interface OfferModalProps {
  listing: Listing;
  onClose: () => void;
  onSubmitOffer: (offerAmount: string) => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({ listing, onClose, onSubmitOffer }) => {
  const [offerAmount, setOfferAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerAmount.trim()) {
      alert("Please enter an offer amount.");
      return;
    }
    onSubmitOffer(offerAmount);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-md relative animate-fade-in-down overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Make an Offer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{listing.title}</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            {/* FIX: Use `imageUrls[0]` as `imageUrl` does not exist on the Listing type. */}
            <img src={listing.imageUrls[0]} alt={listing.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Asking Price:</p>
              <p className="font-bold text-xl text-primary">{listing.price}</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="offerAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Offer Amount (₦)</label>
            <input 
              type="text" 
              id="offerAmount" 
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="mt-1 block w-full input" 
              placeholder="e.g., ₦850,000" 
              required 
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-colors">
              Submit Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};