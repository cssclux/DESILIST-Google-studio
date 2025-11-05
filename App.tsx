import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ListingCard } from './components/ListingCard';
import { PostAdModal } from './components/PostAdModal';
import { Footer } from './components/Footer';
import { MOCK_LISTINGS, CATEGORIES, LOCATIONS } from './constants';
import type { Listing } from './types';
import { SearchIcon, ChevronDownIcon, XCircleIcon, CheckCircleIcon, UsersIcon, BuildingOffice2Icon, BriefcaseIcon, TagIcon, WrenchScrewdriverIcon, LightBulbIcon, MagnifyingGlassCircleIcon } from './components/icons/Icons';
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

  const categoryIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    community: UsersIcon,
    housing: BuildingOffice2Icon,
    jobs: BriefcaseIcon,
    'for-sale': TagIcon,
    services: WrenchScrewdriverIcon,
    gigs: LightBulbIcon,
  };

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
  
  const featuredListings = useMemo(() => 
    listings.filter(listing => listing.isFeatured)
            .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()), 
    [listings]
  );
  
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

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {CATEGORIES.map(category => {
              const Icon = categoryIcons[category.id];
              const isSelected = selectedCategory === category.id;
              return (
                 <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${isSelected ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white hover:shadow-md hover:-translate-y-1'}`}
                >
                  {Icon && <Icon className="h-8 w-8" />}
                  <span className="font-bold">{category.name}</span>
                </button>
              );
            })}
          </div>
           {selectedCategory !== 'all' && CATEGORIES.find(c => c.id === selectedCategory) && (
              <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                  <span className="font-semibold text-gray-700">Subcategories:</span>
                  {CATEGORIES.find(c => c.id === selectedCategory)?.subcategories.map(sub => (
                    <button key={sub.id} onClick={() => setSelectedCategory(sub.id)} className={`text-sm px-3 py-1 rounded-full ${selectedCategory === sub.id ? 'bg-primary text-white font-bold' : 'bg-white text-blue-600 hover:bg-gray-100'}`}>
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
           )}
           <div className="text-center mt-6">
             <button
                onClick={() => setSelectedCategory('all')}
                className={`text-sm font-semibold ${selectedCategory === 'all' ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'}`}
              >
                View All Listings
              </button>
          </div>
        </div>
        
        {featuredListings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Featured Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredListings.map(listing => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  onViewDetails={() => setViewingListing(listing)}
                />
              ))}
            </div>
          </div>
        )}

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
              <div className="col-span-full text-center py-20 bg-white rounded-lg shadow">
                  <MagnifyingGlassCircleIcon className="h-16 w-16 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Listings Found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no listings that match your current filters. Try clearing them to see more.
                  </p>
                  <button onClick={handleClearFilters} className="mt-6 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center text-sm px-4 py-2 mx-auto">
                      <XCircleIcon className="h-4 w-4 mr-1.5" />
                      Clear All Filters
                  </button>
              </div>
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