import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ListingCard } from './components/ListingCard';
import { PostAdModal } from './components/PostAdModal';
import { Footer } from './components/Footer';
import { MOCK_LISTINGS, CATEGORIES, LOCATIONS } from './constants';
import type { Listing } from './types';
import { SearchIcon, ChevronDownIcon, CheckCircleIcon, UsersIcon, BuildingOffice2Icon, BriefcaseIcon, TagIcon, WrenchScrewdriverIcon, LightBulbIcon, MagnifyingGlassCircleIcon } from './components/icons/Icons';
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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

  const handlePostAd = (newListing: Omit<Listing, 'id' | 'seller'>) => {
    const listingWithId: Listing = {
      ...newListing,
      id: Date.now(),
      seller: {
        username: 'Just You',
        joinDate: `Joined ${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()}`,
        rating: 0,
        reviewCount: 0,
      }
    };
    setListings([listingWithId, ...listings]);
    setIsModalOpen(false);
    setSuccessMessage('Your ad has been posted successfully!');
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setSelectedState('all');
    setSelectedCity('all');
  };
  
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
    <div className="flex flex-col min-h-screen text-slate-900 dark:text-slate-100">
      <Header onPostAdClick={() => setIsModalOpen(true)} theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="flex-grow">
        <div 
          className="relative bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?q=80&w=1920&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center py-20 md:py-24 px-4 container mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Your Market, Your Price - OJA.ng</h1>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto">Nigeria's trusted online marketplace for everything you need.</p>
            
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-xl p-2 flex items-center gap-2">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="What are you looking for?"
                    className="w-full pl-10 pr-4 py-3 border-0 rounded-md focus:ring-0 bg-transparent text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative border-l border-white/20 pl-2">
                   <select className="w-full appearance-none bg-transparent border-0 rounded-md py-3 pl-3 pr-10 text-slate-900 dark:text-white focus:outline-none focus:ring-0" value={selectedCountry} onChange={handleCountryChange}>
                    <option value="all" className="text-black">All Nigeria</option>
                    {Object.keys(LOCATIONS).sort().map(country => <option key={country} value={country} className="text-black">{country}</option>)}
                  </select>
                   <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-300"><ChevronDownIcon className="h-4 w-4" /></span>
                </div>
                <button className="bg-secondary text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-light">Browse Our Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                    {CATEGORIES.map(category => {
                    const Icon = categoryIcons[category.id];
                    const isSelected = selectedCategory === category.id;
                    return (
                        <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all duration-300 border ${isSelected ? 'bg-primary/20 dark:bg-primary/30 backdrop-blur-md scale-105 shadow-lg border-primary/50 dark:border-teal-300/50 text-primary dark:text-white' : 'bg-white dark:bg-white/5 backdrop-blur-md border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-none'}`}
                        >
                        {Icon && <Icon className="h-8 w-8" />}
                        <span className="font-bold">{category.name}</span>
                        </button>
                    );
                    })}
                </div>
                {selectedCategory !== 'all' && CATEGORIES.find(c => c.id === selectedCategory) && (
                    <div className="mt-6 p-4 bg-teal-500/10 backdrop-blur-md border border-teal-500/20 rounded-lg">
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Subcategories:</span>
                        {CATEGORIES.find(c => c.id === selectedCategory)?.subcategories.map(sub => (
                            <button key={sub.id} onClick={() => setSelectedCategory(sub.id)} className={`text-sm px-3 py-1 rounded-full transition-colors ${selectedCategory === sub.id ? 'bg-primary text-white font-bold shadow-md' : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/20'}`}>
                            {sub.name}
                            </button>
                        ))}
                        </div>
                    </div>
                )}
                <div className="text-center mt-6">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`text-sm font-semibold transition-colors ${selectedCategory === 'all' ? 'text-secondary font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        View All Listings
                    </button>
                </div>
            </div>
            
            {featuredListings.length > 0 && (
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-light">Featured Ads</h2>
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-light">Recent Ads</h2>
                {successMessage && (
                    <div className="bg-teal-500/20 backdrop-blur-md border border-teal-400/50 text-teal-100 font-semibold p-3 rounded-lg flex items-center animate-fade-in">
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
                <div className="col-span-full text-center py-20 bg-slate-200 dark:bg-white/5 backdrop-blur-lg rounded-lg shadow-xl">
                    <MagnifyingGlassCircleIcon className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-100">No Listings Found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Try adjusting your search or category filters to find what you're looking for.
                    </p>
                </div>
                )}
            </div>
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