import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Listing, User, SavedSearch } from '../types';
import { ListingCard } from './ListingCard';
import { MagnifyingGlassIcon, LightBulbIcon, ArrowPathIcon, BookmarkIcon, MapPinIcon } from './icons/Icons';
import { CategoryNav } from './CategoryNav';
import { CATEGORIES, NIGERIAN_LOCATIONS } from '../constants';
import * as geminiService from '../services/geminiService';


interface HomePageProps {
  listings: Listing[];
  currentUser: User | null;
  onViewDetails: (listing: Listing) => void;
  onDelete: (listingId: string) => void;
  onSaveSearch: (criteria: Omit<SavedSearch, 'id' | 'name'>) => void;
  onMakeOffer: (listing: Listing) => void;
}

const heroBackgroundImage = 'https://i.ibb.co/Zz7p6vdv/hero.png';

export const HomePage: React.FC<HomePageProps> = ({ listings, currentUser, onViewDetails, onDelete, onSaveSearch, onMakeOffer }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [citiesForState, setCitiesForState] = useState<string[]>([]);
  
  // State for AI-powered filters
  const [suggestedFilters, setSuggestedFilters] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSuggestingFilters, setIsSuggestingFilters] = useState(false);
  const debounceTimeoutRef = useRef<number | null>(null);
  
  const [locationStatus, setLocationStatus] = useState('Checking...');

  // Geolocation effect
  useEffect(() => {
    // Check if location has been set before
    if (sessionStorage.getItem('location_set')) {
        setLocationStatus('');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            // We have the user's position, but cannot perform reverse geocoding
            // without a valid API key. We'll just inform the user.
            setLocationStatus('Location detected. Please select your state/city manually.');
            setTimeout(() => setLocationStatus(''), 3000); // Hide status after 3s
            sessionStorage.setItem('location_set', 'true');
        },
        (error) => {
            console.warn(`Geolocation error: ${error.message}`);
            if (error.code === error.PERMISSION_DENIED) {
              setLocationStatus('Location access denied.');
            } else {
              setLocationStatus('Could not determine location.');
            }
            sessionStorage.setItem('location_set', 'true');
            setTimeout(() => setLocationStatus(''), 3000);
        },
        { timeout: 10000 }
    );
}, []);
  
  useEffect(() => {
    if (location.state?.savedSearchCriteria) {
        const criteria = location.state.savedSearchCriteria as SavedSearch;
        
        setSearchTerm(criteria.searchTerm);
        setSelectedMainCategory(criteria.category.main);
        setSelectedSubCategory(criteria.category.sub);
        setActiveFilters(criteria.filters);

        setSelectedState(criteria.location.state);
        if (criteria.location.state) {
            const locationData = NIGERIAN_LOCATIONS.find(loc => loc.state === criteria.location.state);
            setCitiesForState(locationData ? locationData.lgas : []);
        } else {
            setCitiesForState([]);
        }
        setSelectedCity(criteria.location.city);

        navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Debounce the AI call
    if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = window.setTimeout(() => {
        const fetchSuggestions = async () => {
            if (!searchTerm && !selectedSubCategory && !selectedMainCategory) {
                setSuggestedFilters([]);
                return;
            }

            setIsSuggestingFilters(true);
            setActiveFilters([]); // Reset active filters when suggestions change

            const mainCat = CATEGORIES.find(c => c.id === selectedMainCategory);
            const subCat = mainCat?.subcategories.find(s => s.id === selectedSubCategory);
            const categoryName = subCat?.name || mainCat?.name || '';
            
            try {
                const filters = await geminiService.suggestFilters(searchTerm, categoryName);
                setSuggestedFilters(filters);
            } catch (error) {
                console.error("Failed to fetch filter suggestions:", error);
                setSuggestedFilters([]);
            } finally {
                setIsSuggestingFilters(false);
            }
        };

        fetchSuggestions();
    }, 750); // 750ms delay

    return () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    };
}, [searchTerm, selectedMainCategory, selectedSubCategory]);


  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
    if (state) {
        const locationData = NIGERIAN_LOCATIONS.find(loc => loc.state === state);
        setCitiesForState(locationData ? locationData.lgas : []);
    } else {
        setCitiesForState([]);
    }
  };

  const handleSelectSubcategory = (subcategoryId: string | null) => {
    setSelectedSubCategory(subcategoryId);
    if (subcategoryId) {
        const mainCat = CATEGORIES.find(c => c.subcategories.some(s => s.id === subcategoryId));
        setSelectedMainCategory(mainCat?.id || null);
    } else if (selectedMainCategory) {
        // Keep main category selected if "All" is clicked in sub-menu
    } else {
        setSelectedMainCategory(null);
    }
  };
  
  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const handleSaveSearchClick = () => {
    const searchCriteria = {
        searchTerm,
        location: { state: selectedState, city: selectedCity },
        category: { main: selectedMainCategory, sub: selectedSubCategory },
        filters: activeFilters,
    };
    onSaveSearch(searchCriteria);
  };
  
  const isSearchActive = useMemo(() => {
    return !!searchTerm || !!selectedState || !!selectedCity || !!selectedMainCategory || !!selectedSubCategory || activeFilters.length > 0;
  }, [searchTerm, selectedState, selectedCity, selectedMainCategory, selectedSubCategory, activeFilters]);

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
        const searchTermMatch = searchTerm === '' || 
            listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            listing.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const stateMatch = selectedState === '' || listing.location.state === selectedState;
        const cityMatch = selectedCity === '' || listing.location.city === selectedCity;
        
        const subCategoryMatch = !selectedSubCategory || listing.category === selectedSubCategory;
        
        const mainCategoryMatch = !selectedMainCategory || 
            (CATEGORIES.find(c => c.id === selectedMainCategory)?.subcategories.some(s => s.id === listing.category));
            
        const activeFiltersMatch = activeFilters.length === 0 || 
            activeFilters.every(filter => 
                listing.title.toLowerCase().includes(filter.toLowerCase()) || 
                listing.description.toLowerCase().includes(filter.toLowerCase())
            );

        return searchTermMatch && stateMatch && cityMatch && subCategoryMatch && mainCategoryMatch && activeFiltersMatch;
    });
  }, [listings, searchTerm, selectedState, selectedCity, selectedMainCategory, selectedSubCategory, activeFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already live, this is mainly for user experience and accessibility.
    // In a non-live search app, you would trigger the search here.
    console.log("Search submitted");
  };

  return (
    <>
      <section className="relative bg-cover bg-center bg-no-repeat py-24 px-4 text-center mb-12 -mt-8 -mx-4">
          <div
              className="absolute inset-0"
              style={{ backgroundImage: `url(${heroBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          <div className="absolute inset-0 bg-black/75"></div>
          <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                  Nigeria's Online Marketplace
              </h1>
              <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
                  Buy & Sell Anything in Nigeria. Find Cars, Jobs, Real Estate & more.
              </p>
              
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div className="relative md:col-span-2">
                          <MagnifyingGlassIcon className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder="What are you looking for?"
                              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-transparent focus:border-primary focus:ring-primary rounded-lg transition"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <select 
                          className="w-full md:col-span-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-transparent focus:border-primary focus:ring-primary rounded-lg transition"
                          value={selectedState}
                          onChange={handleStateChange}
                      >
                          <option value="">All States</option>
                          {NIGERIAN_LOCATIONS.map(loc => <option key={loc.state} value={loc.state} className="bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200">{loc.state}</option>)}
                      </select>
                      <select 
                          className="w-full md:col-span-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-transparent focus:border-primary focus:ring-primary rounded-lg transition"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          disabled={!selectedState}
                      >
                          <option value="">All Cities / LGAs</option>
                          {citiesForState.map(city => <option key={city} value={city} className="bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200">{city}</option>)}
                      </select>
                       <button
                          type="submit"
                          className="w-full md:col-span-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      >
                          <MagnifyingGlassIcon className="h-5 w-5 md:mr-2" />
                          <span className="hidden md:inline">Search</span>
                      </button>
                  </form>
                   {locationStatus && (
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 animate-fade-in-down-fast">
                          <MapPinIcon className="h-4 w-4"/>
                          <span>{locationStatus}</span>
                      </div>
                  )}
              </div>
          </div>
      </section>

      <CategoryNav 
          categories={CATEGORIES}
          onSelectSubcategory={handleSelectSubcategory}
          onSelectMainCategory={(catId) => {
              setSelectedMainCategory(catId);
              setSelectedSubCategory(null);
          }}
          selectedMainCategory={selectedMainCategory}
          selectedSubCategory={selectedSubCategory}
      />

      {(isSuggestingFilters || suggestedFilters.length > 0) && (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in-down-fast">
          <div className="flex items-center gap-3 mb-3">
            <LightBulbIcon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">AI Suggestions</h3>
            {isSuggestingFilters && <ArrowPathIcon className="h-4 w-4 text-slate-500 animate-spin" />}
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedFilters.map(filter => (
              <button 
                key={filter}
                onClick={() => handleFilterToggle(filter)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 border ${
                  activeFilters.includes(filter) 
                  ? 'bg-primary border-primary text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-200 hover:border-primary/50 dark:hover:border-primary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Latest Classifieds
        </h2>
        {isSearchActive && (
          <button
            onClick={handleSaveSearchClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors animate-fade-in-down-fast"
            title="Save this search"
          >
            <BookmarkIcon className="h-5 w-5" />
            Save Search
          </button>
        )}
      </div>

      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onViewDetails={onViewDetails}
              currentUser={currentUser}
              onDelete={onDelete}
              onMakeOffer={onMakeOffer}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">No Listings Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or location filters.</p>
        </div>
      )}
    </>
  );
};