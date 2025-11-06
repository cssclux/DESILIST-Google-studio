
import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PostAdModal } from './components/PostAdModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { LoginModal } from './components/LoginModal';
import { ContactSellerModal } from './components/ContactSellerModal';
import { HomePage } from './components/HomePage';
import { ProfilePage } from './components/ProfilePage';
import type { Listing, User, Review, SavedSearch } from './types';
import { CATEGORIES, NIGERIAN_LOCATIONS } from './constants';

// --- MOCK DATABASE ---

const initialUsers: User[] = [
  { name: 'Tunde Ojo', email: 'tunde@example.com', phone: '08012345678', joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), reviews: [], savedSearches: [] },
  { name: 'Mrs. Adebayo', email: 'adebayo.props@example.com', phone: '09087654321', joinDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), reviews: [], savedSearches: [] },
  { name: 'HR at TechCorp', email: 'hr@techcorp.ng', phone: '07011223344', joinDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), reviews: [], savedSearches: [] },
  { name: 'CleanSweep Nig.', email: 'info@cleansweep.ng', phone: '08122334455', joinDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(), reviews: [], savedSearches: [] },
];

const initialListings: Listing[] = [
  {
    id: '1', title: 'Slightly Used 2021 MacBook Pro 14" M1 Pro', description: 'Selling my barely used 14-inch MacBook Pro with the powerful M1 Pro chip. It has 16GB of RAM and a 512GB SSD. Perfect condition, comes with original box and charger. No scratches or dents. Battery health is at 98%. Great for developers, video editors, and power users.', price: '₦950,000', category: 'for-sale-electronics', location: { city: 'Ikeja', state: 'Lagos', country: 'Nigeria' }, imageUrl: 'https://picsum.photos/seed/1/400/300', postDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isFeatured: true, seller: initialUsers[0]
  },
  {
    id: '2', title: 'Executive 3-Bedroom Flat for Rent in Lekki Phase 1', description: 'A spacious and well-finished 3-bedroom apartment is available for rent in a serene and secure estate in Lekki Phase 1. All rooms are en-suite, with a large living room, fitted kitchen, and ample parking space. 24/7 power and security.', price: '₦7,000,000/year', category: 'housing-apartments', location: { city: 'Lekki', state: 'Lagos', country: 'Nigeria' }, imageUrl: 'https://picsum.photos/seed/2/400/300', postDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), isFeatured: false, seller: initialUsers[1]
  },
  {
    id: '3', title: 'Senior Frontend Developer (React) - Remote', description: 'We are looking for an experienced Senior Frontend Developer proficient in React, TypeScript, and Next.js to join our remote team. You will be responsible for building and maintaining our user-facing applications and collaborating with our product and design teams. 5+ years of experience required.', price: 'Competitive Salary', category: 'jobs-software', location: { city: 'Abuja Municipal Area Council', state: 'FCT', country: 'Nigeria' }, imageUrl: 'https://picsum.photos/seed/3/400/300', postDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), isFeatured: true, seller: initialUsers[2]
  },
  {
    id: '4', title: 'Professional Cleaning Services for Homes and Offices', description: 'Get your space sparkling clean with our professional cleaning services. We offer regular cleaning, deep cleaning, and post-construction cleaning for both residential and commercial properties in Abuja. Reliable and affordable. Call us for a free quote.', price: 'Request a Quote', category: 'services-household', location: { city: 'Wuse', state: 'FCT', country: 'Nigeria' }, imageUrl: 'https://picsum.photos/seed/4/400/300', postDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), isFeatured: false, seller: initialUsers[3]
  },
  {
    id: '5', title: '2015 Toyota Camry - Tokunbo', description: 'Very clean, foreign-used 2015 Toyota Camry. Accident-free, duty fully paid. Engine and gear are in perfect condition. AC is chilling. Just buy and drive.', price: '₦8,500,000', category: 'for-sale-cars-trucks', location: { city: 'Ikeja', state: 'Lagos', country: 'Nigeria' }, imageUrl: 'https://picsum.photos/seed/5/400/300', postDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isFeatured: false, seller: initialUsers[0]
  },
];

initialUsers[1].reviews = [
    { id: 'rev1', author: initialUsers[0], rating: 5, comment: "The apartment was exactly as described. Mrs. Adebayo was a pleasure to deal with. Highly recommended!", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [allListings, setAllListings] = useState<Listing[]>(initialListings);
  
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [contactListing, setContactListing] = useState<Listing | null>(null);
  const [actionAfterLogin, setActionAfterLogin] = useState<(() => void) | null>(null);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Also respect user's OS preference
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handlePostAdClick = () => {
    if (currentUser) {
      setIsPostAdModalOpen(true);
    } else {
      setActionAfterLogin(() => () => setIsPostAdModalOpen(true));
      setIsLoginModalOpen(true);
    }
  };
  
  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleContactSeller = () => {
    if (selectedListing) {
      if(currentUser) {
        setContactListing(selectedListing);
        setSelectedListing(null); // Close detail modal when opening contact modal
      } else {
        setActionAfterLogin(() => () => {
           setContactListing(selectedListing);
           setSelectedListing(null);
        });
        setIsLoginModalOpen(true);
      }
    }
  };

  const handleLoginSuccess = (user: User) => {
    let userFromDb = allUsers.find(u => u.email === user.email);

    // If user doesn't exist in our mock DB, add them.
    if (!userFromDb) {
      const newUser: User = { 
        ...user, 
        reviews: user.reviews || [], 
        savedSearches: user.savedSearches || [] 
      };
      setAllUsers(prev => [...prev, newUser]);
      userFromDb = newUser;
    }
    
    setCurrentUser(userFromDb); // Set the user from our state, which has all properties.
    setIsLoginModalOpen(false);
    if (actionAfterLogin) {
      actionAfterLogin();
      setActionAfterLogin(null);
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handlePostAd = (newListingData: Omit<Listing, 'id' | 'postDate' | 'isFeatured' | 'seller'>) => {
    if (!currentUser) return;
    
    const newListing: Listing = {
      ...newListingData,
      id: (allListings.length + 1).toString(),
      postDate: new Date().toISOString(),
      isFeatured: false,
      seller: currentUser,
    };
    setAllListings([newListing, ...allListings]);
    setIsPostAdModalOpen(false);
  };

  const handleAddReview = (targetUserEmail: string, reviewData: Omit<Review, 'id' | 'date' | 'author'>) => {
    if (!currentUser) {
        alert("You must be logged in to leave a review.");
        return;
    }

    setAllUsers(prevUsers => {
        return prevUsers.map(user => {
            if (user.email === targetUserEmail) {
                const newReview: Review = {
                    ...reviewData,
                    id: `rev${Date.now()}`,
                    date: new Date().toISOString(),
                    author: currentUser,
                };
                return {
                    ...user,
                    reviews: [newReview, ...(user.reviews || [])]
                };
            }
            return user;
        });
    });
  };

  const handleDeleteListing = (listingId: string) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      setAllListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
    }
  };

  const handleSaveSearch = (criteria: Omit<SavedSearch, 'id' | 'name'>) => {
    if (!currentUser) {
      setActionAfterLogin(() => () => handleSaveSearch(criteria));
      setIsLoginModalOpen(true);
      return;
    }

    const searchName = window.prompt("Enter a name for this search:", "My Saved Search");
    if (!searchName) return;

    const newSearch: SavedSearch = {
      ...criteria,
      id: `search_${Date.now()}`,
      name: searchName,
    };
    
    const updatedUser = {
      ...currentUser,
      savedSearches: [...(currentUser.savedSearches || []), newSearch],
    };
    setCurrentUser(updatedUser);

    setAllUsers(prevUsers => 
      prevUsers.map(u => u.email === currentUser.email ? updatedUser : u)
    );
    
    alert(`Search "${searchName}" saved successfully!`);
  };

  const handleDeleteSearch = (searchId: string) => {
    if (!currentUser) return;
    
    if (window.confirm("Are you sure you want to delete this saved search?")) {
      const updatedSearches = (currentUser.savedSearches || []).filter(s => s.id !== searchId);
      
      const updatedUser = {
        ...currentUser,
        savedSearches: updatedSearches,
      };
      setCurrentUser(updatedUser);

      setAllUsers(prevUsers => 
        prevUsers.map(u => u.email === currentUser.email ? updatedUser : u)
      );
    }
  };


  return (
    <div className="bg-transparent min-h-screen flex flex-col font-sans">
      <Header 
        currentUser={currentUser}
        onPostAdClick={handlePostAdClick}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                listings={allListings}
                currentUser={currentUser}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteListing}
                onSaveSearch={handleSaveSearch}
              />
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <ProfilePage 
                allUsers={allUsers}
                allListings={allListings}
                currentUser={currentUser}
                onViewDetails={handleViewDetails}
                onAddReview={handleAddReview}
                onDelete={handleDeleteListing}
                onDeleteSearch={handleDeleteSearch}
              />
            }
          />
        </Routes>
      </main>

      <Footer />
      
      {isPostAdModalOpen && (
        <PostAdModal
          isOpen={isPostAdModalOpen}
          onClose={() => setIsPostAdModalOpen(false)}
          onPostAd={handlePostAd}
        />
      )}

      {selectedListing && (
        <ListingDetailModal 
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onContactSeller={handleContactSeller}
        />
      )}

      {contactListing && (
        <ContactSellerModal
          listing={contactListing}
          onClose={() => setContactListing(null)}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setActionAfterLogin(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
