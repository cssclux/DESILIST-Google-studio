import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Listing, User } from '../types';
import { XMarkIcon, MapPinIcon, CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, VideoCameraIcon, WhatsAppIcon, TagIcon } from './icons/Icons';

// --- Start of ReportListingModal component ---
interface ReportListingModalProps {
  isOpen: boolean;
  listing: Listing;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const REPORT_REASONS = [
  "Scam or Fraud",
  "Prohibited Item/Service",
  "Incorrectly Categorized",
  "Item is Sold or Ad is Expired",
  "Offensive Content",
  "Other",
];

const ReportListingModal: React.FC<ReportListingModalProps> = ({ isOpen, listing, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (isOpen) {
        setReason('');
        setDetails('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert("Please select a reason for reporting.");
      return;
    }
    if (reason === "Other" && !details.trim()) {
      alert("Please provide details for your report.");
      return;
    }
    onSubmit(reason, details);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex justify-center items-center p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-lg relative animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200/80 dark:border-gray-700/80">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Report Listing</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">Reporting: {listing.title}</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reason for reporting*</label>
            <div className="space-y-2">
              {REPORT_REASONS.map((r) => (
                <label key={r} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="report-reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-4 w-4 text-primary border-slate-300 focus:ring-primary dark:bg-slate-800 dark:border-slate-600"
                  />
                  <span className="text-slate-700 dark:text-slate-200">{r}</span>
                </label>
              ))}
            </div>
          </div>
          {reason === 'Other' && (
            <div className="animate-fade-in-down-fast">
              <label htmlFor="details" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Please provide more details*
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="mt-1 block w-full input"
                placeholder="Explain why you are reporting this ad..."
                required
              />
            </div>
          )}
          <div className="pt-2 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// --- End of ReportListingModal component ---

// Helper function to convert YouTube URL to embeddable URL
const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
        const videoUrl = new URL(url);
        const videoId = videoUrl.searchParams.get('v') || videoUrl.pathname.split('/').pop();
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (error) {
        console.error("Invalid YouTube URL:", url);
    }
    return null;
};

const createWhatsAppLink = (phone: string, message: string): string => {
    let sanitizedPhone = phone.replace(/[^0-9+]/g, '');
    if (sanitizedPhone.length === 11 && sanitizedPhone.startsWith('0')) {
        sanitizedPhone = '234' + sanitizedPhone.substring(1);
    } else if (sanitizedPhone.startsWith('+')) {
        sanitizedPhone = sanitizedPhone.substring(1);
    }
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${sanitizedPhone}?text=${encodedMessage}`;
};


interface ListingDetailModalProps {
  listing: Listing | null;
  currentUser: User | null;
  onClose: () => void;
  onReportListing: (listingId: string, reason: string, details: string) => void;
  onLoginRequired: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, currentUser, onClose, onReportListing, onLoginRequired }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsReportModalOpen(false);
  }, [listing]);
  
  if (!listing) return null;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? listing.imageUrls.length - 1 : prev - 1));
  };
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === listing.imageUrls.length - 1 ? 0 : prev - 1));
  };

  const handleReportSubmit = (reason: string, details: string) => {
    if (listing) {
      onReportListing(listing.id, reason, details);
    }
    setIsReportModalOpen(false);
  };

  const handleWhatsAppChat = () => {
    if (!currentUser) {
        onLoginRequired();
        return;
    }
    if (!listing.seller.phone) return;
    const message = `Hi, I'm interested in your listing: "${listing.title}" on OJA.ng.`;
    const whatsappUrl = createWhatsAppLink(listing.seller.phone, message);
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppOffer = () => {
    if (!currentUser) {
        onLoginRequired();
        return;
    }
    if (!listing.seller.phone) return;
    const message = `Hi, I'd like to make an offer for your listing: "${listing.title}" on OJA.ng.`;
    const whatsappUrl = createWhatsAppLink(listing.seller.phone, message);
    window.open(whatsappUrl, '_blank');
  };

  const formattedDate = new Date(listing.postDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const embedUrl = listing.videoUrl ? getYouTubeEmbedUrl(listing.videoUrl) : null;
  const isOwner = currentUser?.email === listing.seller.email;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
        <div className="glass-card w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row animate-fade-in-down overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="w-full md:w-1/2 relative bg-gray-900">
              <img src={listing.imageUrls[currentImageIndex]} alt={listing.title} className="w-full h-64 md:h-full object-contain" />
               {listing.imageUrls.length > 1 && (
                <>
                  <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors z-10">
                      <ChevronLeftIcon className="h-6 w-6"/>
                  </button>
                  <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors z-10">
                      <ChevronRightIcon className="h-6 w-6"/>
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {listing.imageUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                        className={`h-2 w-2 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
          </div>
          <div className="w-full md:w-1/2 p-6 flex flex-col relative overflow-y-auto">
              <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 z-10">
                  <XMarkIcon className="h-6 w-6" />
              </button>
              
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{listing.title}</h2>
              
              <p className="text-primary dark:text-primary-dark font-extrabold text-4xl mb-4">{listing.price}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4 pb-4 border-b border-gray-200/80 dark:border-gray-700/80">
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
                  <p className="whitespace-pre-wrap">{listing.description}</p>
                  
                  {embedUrl && (
                    <div className="mt-6">
                        <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><VideoCameraIcon className="h-5 w-5"/> Video</h3>
                        <div className="aspect-video">
                           <iframe 
                              src={embedUrl} 
                              title="YouTube video player" 
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                              className="w-full h-full rounded-lg"
                           ></iframe>
                        </div>
                    </div>
                  )}
              </div>
              
              <div className="bg-slate-100/80 dark:bg-slate-700/50 p-4 rounded-lg">
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

              <div className="mt-6 space-y-3">
                {isOwner ? (
                    <p className="text-center p-3 bg-green-500/10 text-green-700 dark:text-green-300 rounded-lg text-sm font-semibold">This is your ad.</p>
                ) : listing.seller.phone ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button 
                            onClick={handleWhatsAppChat}
                            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DAE50] text-white font-bold py-3 px-4 rounded-full w-full shadow-md transition-colors duration-200"
                        >
                            <WhatsAppIcon className="h-5 w-5" />
                            <span>Chat on WhatsApp</span>
                        </button>
                        <button 
                            onClick={handleWhatsAppOffer}
                            className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-full w-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
                        >
                            <TagIcon className="h-5 w-5" />
                            <span>Make an Offer</span>
                        </button>
                    </div>
                ) : (
                    <div className="text-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-500 dark:text-slate-400">
                        Seller has not provided a phone number for contact.
                    </div>
                )}
                
                <button 
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 hover:underline"
                >
                  Report this listing
                </button>
              </div>
          </div>
        </div>
      </div>
      {listing && (
        <ReportListingModal 
            isOpen={isReportModalOpen}
            listing={listing}
            onClose={() => setIsReportModalOpen(false)}
            onSubmit={handleReportSubmit}
        />
      )}
    </>
  );
};