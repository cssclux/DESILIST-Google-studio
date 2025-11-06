

import React, { useState } from 'react';
import type { Listing } from '../types';
import { XMarkIcon, WhatsAppIcon } from './icons/Icons';

interface ContactSellerModalProps {
  listing: Listing;
  onClose: () => void;
  onSubmitMessage: (message: string) => void;
}

export const ContactSellerModal: React.FC<ContactSellerModalProps> = ({ listing, onClose, onSubmitMessage }) => {
  const [message, setMessage] = useState(`Hi ${listing.seller.name.split(' ')[0]}, is the "${listing.title}" still available?`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }
    onSubmitMessage(message);
  };

  const handleWhatsAppChat = () => {
    if (!listing.seller.phone) return;
    // Sanitize phone number: remove non-digit characters except '+' at the start
    const phoneNumber = listing.seller.phone.replace(/[^0-9+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-lg relative animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200/80 dark:border-gray-700/80">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Contact Seller</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">Regarding: {listing.title}</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form id="contact-seller-form" onSubmit={handleSubmit} className="p-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Message</label>
            <textarea 
              id="message" 
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full input" 
              required 
            />
          </div>
        </form>

        <div className="p-4 border-t border-gray-200/80 dark:border-gray-700/80 flex justify-between items-center gap-4">
            <button type="button" onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <div className="flex items-center gap-2">
                {listing.seller.phone && (
                    <button 
                        type="button" 
                        onClick={handleWhatsAppChat}
                        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1DAE50] text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors"
                    >
                        <WhatsAppIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Chat on WhatsApp</span>
                        <span className="sm:hidden">WhatsApp</span>
                    </button>
                )}
                <button type="submit" form="contact-seller-form" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-colors">
                    Send Message
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};