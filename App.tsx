import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ListingCard } from './components/ListingCard';
import { PostAdModal } from './components/PostAdModal';
import { Footer } from './components/Footer';
import { MOCK_LISTINGS, CATEGORIES, LOCATIONS } from './constants';
import type { Listing } from './types';
import { SearchIcon, ChevronDownIcon, XCircleIcon, CheckCircleIcon } from './components/icons/Icons';
import { ListingDetailModal } from './components/ListingDetailModal';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const [viewingListing, setViewingListing] = useState<Listing | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handlePostAd = (newListing: Omit<Listing, 'id'>) => {
    const listingWithId: Listing = {
      ...newListing,
      id: Date.now(),
    };
    setListings([listingWithId, ...listings]);
    setIsModalOpen(false);
    setSuccessMessage('Your ad has been posted successfully!');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCountry('all');
    setSelectedState('all');
    setSelectedCity('all');
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setSelectedState('all');
    setSelectedCity('all');
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedCity('all');
  };

  const availableStates = useMemo(() => {
    return selectedCountry !== 'all' ? Object.keys(LOCATIONS[selectedCountry] || {}).sort() : [];
  }, [selectedCountry]);

  const availableCities = useMemo(() => {
    return selectedCountry !== 'all' && selectedState !== 'all' 
      ? (LOCATIONS[selectedCountry]?.[selectedState] || []).sort() 
      : [];
  }, [selectedCountry, selectedState]);
  
  const filteredListings = useMemo(() => {
    const mainCategory = CATEGORIES.find(c => c.id === selectedCategory);
    const subcategoryIds = mainCategory ? mainCategory.subcategories.map(sc => sc.id) : [];

    return listings
      .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime())
      .filter(listing => {
        const categoryMatch = selectedCategory === 'all' || 
          listing.category === selectedCategory ||
          (mainCategory && subcategoryIds.includes(listing.category));
        
        const searchMatch = searchTerm === '' ||
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const countryMatch = selectedCountry === 'all' || listing.location.country === selectedCountry;
        const stateMatch = selectedState === 'all' || listing.location.state === selectedState;
        const cityMatch = selectedCity === 'all' || listing.location.city === selectedCity;

        return categoryMatch && searchMatch && countryMatch && stateMatch && cityMatch;
      });
  }, [listings, selectedCategory, searchTerm, selectedCountry, selectedState, selectedCity]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onPostAdClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div 
          className="relative rounded-xl overflow-hidden mb-12 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547471080-7cc2d5d88e93?q=80&w=1920&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center py-20 md:py-28 px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Your Community Marketplace</h1>
            <p className="text-lg text-slate-200">The best place to buy, sell, and connect within the community.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 sticky top-20 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative lg:col-span-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input 
                type="text" 
                placeholder="What are you looking for?"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-primary focus:border-primary" value={selectedCountry} onChange={handleCountryChange}>
                <option value="all">All Countries</option>
                {Object.keys(LOCATIONS).sort().map(country => <option key={country} value={country}>{country}</option>)}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDownIcon className="h-4 w-4" /></span>
            </div>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-primary focus:border-primary" value={selectedState} onChange={handleStateChange} disabled={selectedCountry === 'all'}>
                <option value="all">All States/Regions</option>
                {availableStates.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDownIcon className="h-4 w-4" /></span>
            </div>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-primary focus:border-primary" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={selectedState === 'all'}>
                <option value="all">All Cities</option>
                 {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDownIcon className="h-4 w-4" /></span>
            </div>
            <button onClick={handleClearFilters} className="bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center text-sm">
                <XCircleIcon className="h-4 w-4 mr-1.5" />
                Clear Filters
            </button>
          </div>
        </div>

        <div className="mb-8 p-4 bg-white/60 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-6">
            {CATEGORIES.map(category => (
              <div key={category.id}>
                 <button 
                  onClick={() => setSelectedCategory(category.id)}
                  className={`font-bold text-left w-full mb-2 ${selectedCategory === category.id ? 'text-primary' : 'text-gray-800 hover:text-primary'}`}
                >
                  {category.name}
                </button>
                <ul className="space-y-1">
                  {category.subcategories.map(sub => (
                    <li key={sub.id}>
                      <button
                        onClick={() => setSelectedCategory(sub.id)}
                        className={`text-sm text-left w-full ${selectedCategory === sub.id ? 'font-bold text-primary' : 'text-blue-600 hover:underline'}`}
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
             <button
                onClick={() => setSelectedCategory('all')}
                className={`text-sm font-semibold ${selectedCategory === 'all' ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'}`}
              >
                View All Listings
              </button>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold">Recent Listings</h2>
             {successMessage && (
                <div className="bg-teal-50 text-teal-700 font-semibold p-3 rounded-lg flex items-center animate-fade-in">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    {successMessage}
                </div>
             )}
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.length > 0 ? (
              filteredListings.map(listing => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  onViewDetails={() => setViewingListing(listing)}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-10">No listings match your criteria.</p>
            )}
          </div>
        </div>
      </main>
      
      {isModalOpen && (
        <PostAdModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handlePostAd} 
        />
      )}

      {viewingListing && (
        <ListingDetailModal 
          listing={viewingListing}
          onClose={() => setViewingListing(null)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default App;