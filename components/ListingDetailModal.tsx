import React, { useState } from 'react';
import type { Listing } from '../types';
import { XMarkIcon, MapPinIcon, PaperAirplaneIcon, CheckCircleIcon, UserCircleIcon, CalendarDaysIcon, FlagIcon } from './icons/Icons';

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return 'Today';
  if (diffDays <= 30) return `${diffDays} days ago`;
  return `on ${date.toLocaleDateString()}`;
};


export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const [message, setMessage] = useState(`Hi, I'm interested in your "${listing.title}". Is it still available?`);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    // Mock API call to simulate sending the message
    setTimeout(() => {
      console.log('Message sent:', {
        listingId: listing.id,
        message,
      });
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };

  const handleReport = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to report this listing as inappropriate or fraudulent?"
    );
    if (isConfirmed) {
      console.log(`Listing reported: ID=${listing.id}, Title="${listing.title}"`);
      setIsReported(true);
    }
  };

  const formattedLocation = `${listing.location.city}, ${listing.location.state}, ${listing.location.country}`;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row" 
        onClick={e => e.stopPropagation()}
      >
        <div className="md:w-1/2">
          <img src={listing.imageUrl} alt={listing.title} className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none" />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close dialog">
            <XMarkIcon className="h-6 w-6" />
          </button>
          <h2 id="listing-title" className="text-3xl font-bold text-dark mb-2">{listing.title}</h2>
          <p className="text-primary font-bold text-2xl mb-4">{listing.price}</p>
          
           <div className="text-sm text-gray-500 mb-4">
             Posted {formatDate(listing.postDate)}
          </div>

          <div className="text-gray-600 mb-4 space-y-2">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{formattedLocation}</span>
            </div>
            <div className="flex items-center text-sm pt-1">
                <UserCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-gray-500" />
                <span className="font-semibold text-gray-800">{listing.seller.username}</span>
                <span className="mx-2 text-gray-400">•</span>
                <CalendarDaysIcon className="h-5 w-5 mr-1.5 flex-shrink-0 text-gray-500" />
                <span>{listing.seller.joinDate}</span>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto mb-6 pr-4">
            <h3 className="font-bold text-dark mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
          </div>
          
          <div className="mt-auto">
            {isSent ? (
              <div className="bg-teal-50 text-teal-800 p-4 rounded-lg flex items-center justify-center border border-teal-200">
                <CheckCircleIcon className="h-6 w-6 mr-3"/>
                <span className="font-semibold">Message Sent! The seller will get back to you soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Send a message</label>
                <textarea 
                  id="message" 
                  rows={3} 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSending}
                  required
                ></textarea>
                <button 
                  type="submit" 
                  disabled={isSending}
                  className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition duration-300 w-full flex items-center justify-center mt-2 disabled:bg-teal-300 disabled:cursor-not-allowed"
                >
                   <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                   {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
             <div className="text-center mt-4">
              {isReported ? (
                 <p className="text-sm text-gray-500 py-2">Thank you, this listing has been reported.</p>
              ) : (
                <button 
                  onClick={handleReport}
                  className="text-sm text-red-600 hover:text-red-800 font-semibold flex items-center justify-center w-full p-2 rounded-md hover:bg-red-50"
                  aria-label="Report this listing"
                >
                  <FlagIcon className="h-4 w-4 mr-1.5" />
                  Report this listing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};