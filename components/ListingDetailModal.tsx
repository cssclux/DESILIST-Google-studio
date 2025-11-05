import React, { useState, useMemo } from 'react';
import type { Listing } from '../types';
import { 
    XMarkIcon, MapPinIcon, PaperAirplaneIcon, CheckCircleIcon, 
    UserCircleIcon, CalendarDaysIcon, FlagIcon, StarIcon,
    ShieldCheckIcon, TruckIcon, AtSymbolIcon, UsersIcon, BanknotesIcon, CubeTransparentIcon, ArchiveBoxIcon, MapIcon
} from './icons/Icons';

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
}

const StarRating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className="h-5 w-5 text-secondary" />)}
                {halfStar && <StarIcon key="half" className="h-5 w-5 text-secondary" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
                {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="h-5 w-5 text-slate-400 dark:text-slate-600" />)}
            </div>
            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300 font-semibold">{rating.toFixed(1)}</span>
            <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">({reviewCount} reviews)</span>
        </div>
    );
};

const DetailItem: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>, text: string }> = ({ icon: Icon, text }) => (
    <div className="flex items-center text-sm text-slate-700 dark:text-slate-200">
        <Icon className="h-5 w-5 mr-3 text-teal-500 dark:text-teal-400 flex-shrink-0" />
        <span>{text}</span>
    </div>
);

const DeliveryStatusTracker: React.FC<{ status: NonNullable<Listing['deliveryStatus']> }> = ({ status }) => {
    const stages = [
        { id: 'processing', text: 'Processing Order', icon: ArchiveBoxIcon },
        { id: 'shipped', text: 'Item Shipped', icon: TruckIcon },
        { id: 'out-for-delivery', text: 'Out for Delivery', icon: TruckIcon },
        { id: 'delivered', text: 'Delivered', icon: CheckCircleIcon }
    ];
    const currentIndex = stages.findIndex(s => s.id === status);

    return (
      <div className="border-t border-slate-300 dark:border-white/10 pt-4 mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Delivery Status</h3>
        <div className="relative pl-5">
            {stages.map((stage, index) => {
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;

                return (
                    <div key={stage.id} className="relative pb-8">
                        {index < stages.length - 1 && (
                            <div className={`absolute top-5 left-5 -ml-px h-full w-0.5 ${isCompleted ? 'bg-teal-400' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        )}
                        <div className="flex items-center">
                            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${isCompleted || isActive ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                <stage.icon className={`h-5 w-5 ${isCompleted || isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                            </div>
                            <div className={`ml-4 font-semibold ${isActive ? 'text-slate-900 dark:text-white' : isCompleted ? 'text-teal-600 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                {stage.text}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
    );
}


export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const [message, setMessage] = useState(`Hi, I'm interested in your "${listing.title}". Is it still available?`);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isReported, setIsReported] = useState(false);
  
  const deliveryOptions = useMemo(() => ({
    'courier': { icon: TruckIcon, text: 'Courier Service' },
    'in-person': { icon: UsersIcon, text: 'In-Person Meetup' },
    'email': { icon: AtSymbolIcon, text: 'Email Delivery' },
  }), []);

  const paymentOptions = useMemo(() => ({
    'crypto': { icon: CubeTransparentIcon, text: 'Cryptocurrency' },
    'bank-transfer': { icon: BanknotesIcon, text: 'Bank Transfer' },
    'other': { icon: CheckCircleIcon, text: 'Other Methods' },
  }), []);


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

  const handleReportListing = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to report this listing as inappropriate or fraudulent?"
    );
    if (isConfirmed) {
      console.log(`Listing reported: ID=${listing.id}, Title="${listing.title}"`);
      setIsReported(true);
    }
  };

  const handleReportUser = () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to report the user "${listing.seller.username}" for their activity on the platform?`
    );
    if (isConfirmed) {
      console.log(`User reported: USERNAME=${listing.seller.username}, associated with Listing ID=${listing.id}`);
      setIsReported(true);
    }
  };


  const formattedLocation = `${listing.location.city}, ${listing.location.state}, ${listing.location.country}`;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-title"
    >
      <div 
        className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-2xl border border-slate-300 dark:border-white/10 shadow-2xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row" 
        onClick={e => e.stopPropagation()}
      >
        <div className="md:w-[55%] flex-shrink-0">
          <img src={listing.imageUrl} alt={listing.title} className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none" />
        </div>
        <div className="md:w-[45%] p-6 flex flex-col relative overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="Close dialog">
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <div className="flex-grow flex flex-col pr-2">
            <h2 id="listing-title" className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{listing.title}</h2>
            <p className="text-teal-600 dark:text-teal-400 font-bold text-2xl mb-4">{listing.price}</p>
            
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="truncate" title={formattedLocation}>{listing.location.address || formattedLocation}</span>
            </div>
            
            <div className="border-t border-b border-slate-300 dark:border-white/10 py-4 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Description</h3>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto">{listing.description}</p>
            </div>

            {listing.deliveryStatus && (
              <DeliveryStatusTracker status={listing.deliveryStatus} />
            )}
            
            <div className="border-t border-slate-300 dark:border-white/10 pt-4 mb-4">
                <div className="flex items-center mb-3">
                    <MapIcon className="h-5 w-5 mr-2 text-slate-600 dark:text-slate-300"/>
                    <h3 className="font-bold text-slate-900 dark:text-white">Location</h3>
                </div>
                <div className="w-full h-48 rounded-lg overflow-hidden border border-slate-300 dark:border-white/10">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${listing.location.lat},${listing.location.lng}&zoom=14`}>
                    </iframe>
                </div>
            </div>

             <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Seller Information</h3>
                <div className="flex items-start text-sm">
                    <UserCircleIcon className="h-10 w-10 mr-3 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                    <div className="flex-grow">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-base">{listing.seller.username}</span>
                        <div className="text-slate-500 dark:text-slate-400 flex items-center text-xs mt-1">
                            <CalendarDaysIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{listing.seller.joinDate}</span>
                        </div>
                    </div>
                </div>
                 <div className="mt-3 pt-3 border-t border-slate-300 dark:border-white/10">
                    <StarRating rating={listing.seller.rating} reviewCount={listing.seller.reviewCount} />
                </div>
             </div>
             
             <div className="border-t border-slate-300 dark:border-white/10 pt-4 mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Transaction & Delivery</h3>
                <div className="space-y-3">
                    {listing.acceptsEscrow && (
                        <div className="flex items-center p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                            <ShieldCheckIcon className="h-6 w-6 mr-3 text-teal-500 dark:text-teal-300 flex-shrink-0" />
                            <div>
                                <p className="font-semibold bg-gradient-to-r from-teal-500 to-green-500 dark:from-teal-300 dark:to-green-300 text-transparent bg-clip-text">Escrow Protection Available</p>
                                <p className="text-xs text-teal-600 dark:text-teal-400">Your payment is held securely until you confirm you're satisfied.</p>
                            </div>
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-slate-600 dark:text-slate-300 text-sm mb-2">Delivery Options</h4>
                        <div className="space-y-2">
                            {listing.deliveryMethods.map(method => (
                                <DetailItem key={method} icon={deliveryOptions[method].icon} text={deliveryOptions[method].text} />
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-600 dark:text-slate-300 text-sm mb-2">Accepted Payments</h4>
                        <div className="space-y-2">
                            {listing.paymentMethods.map(method => (
                                <DetailItem key={method} icon={paymentOptions[method].icon} text={paymentOptions[method].text} />
                            ))}
                        </div>
                    </div>
                </div>
             </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-300 dark:border-white/10">
            {isSent ? (
              <div className="bg-teal-500/20 text-teal-800 dark:text-teal-200 p-4 rounded-lg flex items-center justify-center border border-teal-500/30">
                <CheckCircleIcon className="h-6 w-6 mr-3"/>
                <span className="font-semibold">Message Sent!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Send a message</label>
                <textarea 
                  id="message" 
                  rows={2} 
                  className="w-full bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-secondary focus:border-secondary text-slate-900 dark:text-slate-100"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSending}
                  required
                ></textarea>
                <button 
                  type="submit" 
                  disabled={isSending}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 w-full flex items-center justify-center mt-2 shadow-md hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] disabled:from-teal-600 disabled:to-cyan-600 disabled:shadow-none disabled:cursor-not-allowed"
                >
                   <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                   {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
             <div className="text-center mt-3">
              {isReported ? (
                 <p className="text-sm text-slate-500 dark:text-slate-400 py-1">Thank you, your report has been submitted.</p>
              ) : (
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={handleReportListing}
                    className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-semibold flex items-center p-1 rounded-md hover:bg-red-500/10"
                    aria-label="Report this listing"
                  >
                    <FlagIcon className="h-3 w-3 mr-1" />
                    Report Listing
                  </button>
                   <button 
                    onClick={handleReportUser}
                    className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-semibold flex items-center p-1 rounded-md hover:bg-red-500/10"
                    aria-label={`Report user ${listing.seller.username}`}
                  >
                    <FlagIcon className="h-3 w-3 mr-1" />
                    Report User
                  </button>
                </div>
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
        /* Custom scrollbar for webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }
        .dark .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};