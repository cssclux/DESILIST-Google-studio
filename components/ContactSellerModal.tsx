import React from 'react';
import type { Listing } from '../types';
import { XMarkIcon, MapPinIcon, WhatsAppIcon } from './icons/Icons';
import { Link } from 'react-router-dom';

interface ContactSellerModalProps {
  listing: Listing;
  onClose: () => void;
}

export const ContactSellerModal: React.FC<ContactSellerModalProps> = ({ listing, onClose }) => {
  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.substring(1);
    }
    return cleaned;
  };

  const phoneNumber = formatPhoneNumber(listing.seller.phone);
  const message = `Hi, I'm interested in your listing on OJA.ng: "${listing.title}". Is it still available?`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-lg relative animate-fade-in-down overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Contact Seller</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Continue the conversation on WhatsApp</p>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>

        <div className="p-6">
            <div className="bg-slate-900/10 dark:bg-slate-700/50 p-4 rounded-lg mb-6 flex items-center gap-4">
                <img src={listing.seller.avatarUrl || `https://i.pravatar.cc/150?u=${listing.seller.email}`} alt={listing.seller.name} className="h-16 w-16 rounded-full border-2 border-primary/50"/>
                <div>
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">
                        <Link to={`/profile/${listing.seller.email}`} onClick={onClose} className="hover:underline">
                            {listing.seller.name}
                        </Link>
                    </h3>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <MapPinIcon className="h-4 w-4 mr-1.5" />
                        <span>{`${listing.location.city}, ${listing.location.state}`}</span>
                    </div>
                </div>
            </div>

            <div className="text-center py-4">
                <p className="text-slate-600 dark:text-slate-300 mb-4">Click the button below to start a chat with <strong>{listing.seller.name.split(' ')[0]}</strong> directly on WhatsApp.</p>
                
                <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-px"
                >
                    <WhatsAppIcon className="h-6 w-6" />
                    Chat on WhatsApp
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};