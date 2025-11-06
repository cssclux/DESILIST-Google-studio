import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { User, Listing, Review, SavedSearch } from '../types';
import { ListingCard } from './ListingCard';
import { CalendarDaysIcon, StarIconSolid, BookmarkSquareIcon, TrashIcon, MagnifyingGlassIcon } from './icons/Icons';

interface ProfilePageProps {
  allUsers: User[];
  allListings: Listing[];
  currentUser: User | null;
  onViewDetails: (listing: Listing) => void;
  onAddReview: (targetUserEmail: string, reviewData: Omit<Review, 'id' | 'date' | 'author'>) => void;
  onDelete: (listingId: string) => void;
  onDeleteSearch: (searchId: string) => void;
  onLoginRequired: () => void;
}

const StarRating: React.FC<{ rating: number, setRating?: (r: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating?.(star)}
                    className={!setRating ? 'cursor-default' : ''}
                    aria-label={`Rate ${star} stars`}
                >
                    <StarIconSolid className={`h-6 w-6 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
                </button>
            ))}
        </div>
    );
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ allUsers, allListings, currentUser, onViewDetails, onAddReview, onDelete, onDeleteSearch, onLoginRequired }) => {
  const { userId } = useParams<{ userId: string }>();
  type Tab = 'listings' | 'reviews' | 'searches';
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const navigate = useNavigate();

  const user = useMemo(() => allUsers.find(u => u.email === userId), [allUsers, userId]);
  const userListings = useMemo(() => allListings.filter(l => l.seller.email === userId), [allListings, userId]);

  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16 glass-card">
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">User Not Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">The profile you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewComment.trim() === '') {
        alert("Please enter a comment for your review.");
        return;
    }
    onAddReview(user.email, { rating: newReviewRating, comment: newReviewComment });
    setNewReviewComment('');
    setNewReviewRating(5);
  };
  
  const averageRating = useMemo(() => {
    if (!user.reviews || user.reviews.length === 0) return 0;
    const total = user.reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / user.reviews.length;
  }, [user.reviews]);

  const handleViewSearch = (search: SavedSearch) => {
    navigate('/', { state: { savedSearchCriteria: search } });
  };

  const isOwnProfile = currentUser?.email === user.email;

  const tabs = [
    { id: 'listings', label: `Listings (${userListings.length})`, visible: true },
    { id: 'reviews', label: `Reviews (${user.reviews?.length || 0})`, visible: true },
    { id: 'searches', label: `Saved Searches (${user.savedSearches?.length || 0})`, visible: isOwnProfile },
  ].filter(tab => tab.visible);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <header className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <img src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} className="h-32 w-32 rounded-full border-4 border-primary/50 shadow-lg"/>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CalendarDaysIcon className="h-5 w-5" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <StarIconSolid className="w-5 h-5 text-yellow-400" />
                  <span>{averageRating.toFixed(1)} ({user.reviews?.length || 0} reviews)</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="glass-card overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div role="tablist" aria-label="User Profile Sections" className="flex space-x-1 sm:space-x-2 px-2 sm:px-4">
                    {tabs.map((tab) => (
                         <button
                            key={tab.id}
                            id={`tab-${tab.id}`}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`panel-${tab.id}`}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`px-3 sm:px-4 py-3 text-sm sm:text-base font-semibold border-b-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 rounded-t-md transition-colors duration-200 ${
                              activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="p-6">
                <div id="panel-listings" role="tabpanel" aria-labelledby="tab-listings" className={activeTab === 'listings' ? 'animate-fade-in-down-fast' : 'hidden'}>
                    {userListings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userListings.map(listing => <ListingCard key={listing.id} listing={listing} currentUser={currentUser} onViewDetails={onViewDetails} onDelete={onDelete} onLoginRequired={onLoginRequired} />)}
                        </div>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-8">This user has no active listings.</p>
                    )}
                </div>

                <div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" className={activeTab === 'reviews' ? 'animate-fade-in-down-fast' : 'hidden'}>
                    <div className="space-y-6">
                        {currentUser && !isOwnProfile && (
                            <form onSubmit={handleReviewSubmit} className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-3">
                                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Leave a Review for {user.name.split(' ')[0]}</h3>
                                <StarRating rating={newReviewRating} setRating={setNewReviewRating} />
                                <textarea value={newReviewComment} onChange={e => setNewReviewComment(e.target.value)} rows={3} placeholder="Share your experience..." className="w-full input" required></textarea>
                                <div className="text-right">
                                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-5 rounded-full shadow-md transition-colors">Submit Review</button>
                                </div>
                            </form>
                        )}
                        
                        {user.reviews && user.reviews.length > 0 ? (
                            <div className="space-y-4">
                              {user.reviews.map(review => (
                                  <div key={review.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-start gap-4">
                                      <img src={review.author.avatarUrl || `https://i.pravatar.cc/150?u=${review.author.email}`} alt={review.author.name} className="h-12 w-12 rounded-full flex-shrink-0" />
                                      <div>
                                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                              <div>
                                                  <p className="font-bold text-slate-800 dark:text-slate-100">{review.author.name}</p>
                                                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                                              </div>
                                              <div className="mt-2 sm:mt-0">
                                                <StarRating rating={review.rating} />
                                              </div>
                                          </div>
                                          <p className="mt-2 text-slate-600 dark:text-slate-300">{review.comment}</p>
                                      </div>
                                  </div>
                              ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-8">This user has no reviews yet.</p>
                        )}
                    </div>
                </div>

                <div id="panel-searches" role="tabpanel" aria-labelledby="tab-searches" className={activeTab === 'searches' ? 'animate-fade-in-down-fast' : 'hidden'}>
                    {isOwnProfile && (
                      <div className="space-y-4">
                        {user.savedSearches && user.savedSearches.length > 0 ? (
                          user.savedSearches.map(search => (
                            <div key={search.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <BookmarkSquareIcon className="h-8 w-8 text-primary flex-shrink-0" />
                                <div>
                                  <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{search.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-xs">
                                    {search.searchTerm || 'Anything'} in {search.location.city || search.location.state || 'Anywhere'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                                <button
                                  onClick={() => handleViewSearch(search)}
                                  className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm py-2 px-4 rounded-full transition-colors"
                                  title="View search results"
                                >
                                  <MagnifyingGlassIcon className="h-4 w-4" /> View
                                </button>
                                 <button
                                  onClick={() => onDeleteSearch(search.id)}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors"
                                  title="Delete saved search"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500 dark:text-slate-400 text-center py-8">You have no saved searches. Save a search from the homepage to see it here.</p>
                        )}
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};