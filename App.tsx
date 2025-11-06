

import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ProfilePage } from './components/ProfilePage';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PostAdModal } from './components/PostAdModal';
import { LoginModal } from './components/LoginModal';
import { ChatModal } from './components/ChatModal';
import { OfferModal } from './components/OfferModal';
import type { Listing, User, Review, SavedSearch, ChatThread, Message } from './types';

const MOCK_USERS: User[] = [
    { email: 'john.doe@example.com', name: 'John Doe', joinDate: '2023-01-15T10:00:00Z', savedSearches: [], reviews: [], password: 'password123', phone: '+2348012345678' },
    { email: 'jane.smith@example.com', name: 'Jane Smith', joinDate: '2023-02-20T11:30:00Z', savedSearches: [], reviews: [], phone: '+2348023456789' },
    { email: 'bayo.adekunle@example.com', name: 'Bayo Adekunle', joinDate: '2023-03-10T09:00:00Z', savedSearches: [], reviews: [], password: 'password123' }
];

const MOCK_LISTINGS: Listing[] = [
    { id: '1', title: 'Slightly Used Toyota Camry 2018', description: 'Very clean, accident-free Toyota Camry. Buy and drive.', price: '₦12,500,000', category: 'for-sale-cars-trucks', location: { country: 'Nigeria', state: 'Lagos', city: 'Ikeja' }, imageUrls: ['https://i.ibb.co/6rC6PzT/camry.jpg', 'https://i.ibb.co/gDFs2wL/camry-interior.jpg', 'https://i.ibb.co/xJg3PFr/camry-engine.jpg'], seller: MOCK_USERS[0], postDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isFeatured: true, videoUrl: 'https://www.youtube.com/watch?v=Sc_6G_eTR5E' },
    { id: '2', title: '3 Bedroom Flat for Rent in Lekki Phase 1', description: 'A spacious and well-maintained 3 bedroom flat with all rooms en-suite, fitted kitchen, and ample parking space.', price: '₦5,000,000 / year', category: 'housing-apartments', location: { country: 'Nigeria', state: 'Lagos', city: 'Eti Osa' }, imageUrls: ['https://i.ibb.co/3YYxWbF/apartment.jpg', 'https://i.ibb.co/yqgJm1Q/apartment-living.jpg', 'https://i.ibb.co/B2S05gN/apartment-kitchen.jpg', 'https://i.ibb.co/Xz9d9Yt/apartment-bedroom.jpg'], seller: MOCK_USERS[1], postDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', title: 'Brand New iPhone 14 Pro Max', description: '256GB, Deep Purple, sealed in box. USA spec.', price: '₦950,000', category: 'for-sale-cell-phones', location: { country: 'Nigeria', state: 'FCT', city: 'Abuja Municipal Area Council' }, imageUrls: ['https://i.ibb.co/D8d3smJ/iphone.jpg', 'https://i.ibb.co/7jWqN7r/iphone-back.jpg', 'https://i.ibb.co/vVRSR1G/iphone-box.jpg'], seller: MOCK_USERS[2], postDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '4', title: 'Senior Frontend Engineer (React)', description: 'We are looking for an experienced Frontend Engineer to join our team. Must be proficient in React, TypeScript, and modern CSS.', price: 'Competitive Salary', category: 'jobs-software', location: { country: 'Nigeria', state: 'Lagos', city: 'Lagos Mainland' }, imageUrls: ['https://i.ibb.co/L9jBwLw/job.jpg', 'https://i.ibb.co/7JdkyzQ/office.jpg', 'https://i.ibb.co/wJMyB4F/code.jpg'], seller: MOCK_USERS[1], postDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '5', title: 'Quality Leather Sofa Set', description: 'A 7-seater leather sofa, barely used. Very comfortable and stylish. Selling because I am relocating.', price: '₦450,000', category: 'for-sale-furniture', location: { country: 'Nigeria', state: 'Oyo', city: 'Ibadan North' }, imageUrls: ['https://i.ibb.co/Jqj8pCF/sofa.jpg', 'https://i.ibb.co/7kL3R5x/sofa-side.jpg', 'https://i.ibb.co/tLW4MZS/sofa-living-room.jpg'], seller: MOCK_USERS[0], postDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), isFeatured: true },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [allListings, setAllListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [offerListing, setOfferListing] = useState<Listing | null>(null);
  
  // Chat state
  const [chatTarget, setChatTarget] = useState<{ listing: Listing } | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  
  const location = useLocation();

  useEffect(() => {
    // Persist and apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Close modals on route change
  useEffect(() => {
    setSelectedListing(null);
    setIsPostAdModalOpen(false);
  }, [location]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleEmailSignUp = async (details: { name: string; email: string; password: string }) => {
    const existingUser = allUsers.find(u => u.email === details.email);
    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }
    const newUser: User = {
        name: details.name,
        email: details.email,
        password: details.password,
        joinDate: new Date().toISOString(),
        avatarUrl: `https://i.pravatar.cc/150?u=${details.email}`,
        reviews: [],
        savedSearches: [],
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoginModalOpen(false);
  };

  const handleEmailLogin = async (credentials: { email: string; password: string }) => {
    const user = allUsers.find(u => u.email === credentials.email);
    if (!user || user.password !== credentials.password) {
        throw new Error("Invalid email or password.");
    }
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };
  
  const handleGoogleLogin = () => {
    // Simulate logging in with a pre-existing "Google" account (jane.smith)
    const googleUser = allUsers.find(u => u.email === 'jane.smith@example.com');
    if (googleUser) {
        setCurrentUser(googleUser);
        setIsLoginModalOpen(false);
    } else {
        // Or create it if it doesn't exist
        const newGoogleUser: User = {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            joinDate: new Date().toISOString(),
            avatarUrl: `https://i.pravatar.cc/150?u=jane.smith@example.com`,
            reviews: [],
            savedSearches: [],
        };
        setAllUsers(prev => [...prev, newGoogleUser]);
        setCurrentUser(newGoogleUser);
        setIsLoginModalOpen(false);
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const handlePostAd = (newListing: Omit<Listing, 'id' | 'seller' | 'postDate'>) => {
    if (!currentUser) {
      alert("You must be logged in to post an ad.");
      setIsLoginModalOpen(true);
      return;
    }
    const fullListing: Listing = {
      ...newListing,
      id: `listing-${Date.now()}`,
      seller: currentUser,
      postDate: new Date().toISOString(),
    };
    setAllListings(prev => [fullListing, ...prev]);
    setIsPostAdModalOpen(false);
    alert("Your ad has been posted successfully!");
  };

  const handleDeleteListing = (listingId: string) => {
    if (!currentUser) return;
    if (window.confirm("Are you sure you want to delete this listing?")) {
        setAllListings(prev => prev.filter(l => l.id !== listingId || l.seller.email !== currentUser.email));
    }
  };
  
  const handleAddReview = (targetUserEmail: string, reviewData: Omit<Review, 'id' | 'date' | 'author'>) => {
      if (!currentUser) {
          alert("You need to be logged in to leave a review.");
          setIsLoginModalOpen(true);
          return;
      }
      setAllUsers(prevUsers => prevUsers.map(user => {
          if (user.email === targetUserEmail) {
              const newReview: Review = {
                  ...reviewData,
                  id: `review-${Date.now()}`,
                  date: new Date().toISOString(),
                  author: currentUser,
              };
              return {
                  ...user,
                  reviews: [...(user.reviews || []), newReview],
              };
          }
          return user;
      }));
      alert("Your review has been submitted!");
  };

  const handleSaveSearch = (criteria: Omit<SavedSearch, 'id' | 'name'>) => {
    if (!currentUser) {
        alert("Please log in to save your search.");
        setIsLoginModalOpen(true);
        return;
    }
    const name = prompt("Enter a name for this search:", criteria.searchTerm || "My Search");
    if (!name) return;

    const newSearch: SavedSearch = {
      ...criteria,
      id: `search-${Date.now()}`,
      name,
    };
    
    const updatedUser = { ...currentUser, savedSearches: [...(currentUser.savedSearches || []), newSearch] };
    setCurrentUser(updatedUser);
    setAllUsers(prevUsers => prevUsers.map(u => u.email === currentUser.email ? updatedUser : u));
    alert("Search saved successfully!");
  };

  const handleDeleteSearch = (searchId: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, savedSearches: currentUser.savedSearches?.filter(s => s.id !== searchId) };
    setCurrentUser(updatedUser);
    setAllUsers(prevUsers => prevUsers.map(u => u.email === currentUser.email ? updatedUser : u));
  };

  const handleOpenChat = (listing: Listing) => {
      if (!currentUser) {
          alert("Please log in to contact the seller.");
          setIsLoginModalOpen(true);
      } else if (currentUser.email === listing.seller.email) {
          alert("You cannot send a message to yourself.");
      } else {
          setChatTarget({ listing });
          setSelectedListing(null); // Close detail modal
      }
  };

  const handleSendMessage = (threadId: string, text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: currentUser,
        text,
        timestamp: new Date().toISOString(),
    };
    
    setChatThreads(prevThreads => {
        const existingThread = prevThreads.find(t => t.id === threadId);
        if (existingThread) {
            return prevThreads.map(t => t.id === threadId ? { ...t, messages: [...t.messages, newMessage] } : t);
        } else if (chatTarget) {
            const newThread: ChatThread = {
                id: threadId,
                listing: chatTarget.listing,
                buyer: currentUser,
                seller: chatTarget.listing.seller,
                messages: [newMessage],
            };
            return [...prevThreads, newThread];
        }
        return prevThreads;
    });
  };
  
  const handleMakeOffer = (listing: Listing) => {
      if (!currentUser) {
          alert("Please log in to make an offer.");
          setIsLoginModalOpen(true);
      } else {
          setOfferListing(listing);
          setSelectedListing(null); // Close detail modal if open
      }
  };

  const handleSubmitOffer = (offerAmount: string) => {
      if (offerListing) {
          alert(`Your offer of ${offerAmount} for "${offerListing.title}" has been sent to the seller.`);
          setOfferListing(null);
      }
  };

  const handleReportListing = (listingId: string, reason: string, details: string) => {
    const listingToReport = allListings.find(l => l.id === listingId);
    if (listingToReport) {
        // In a real app, this would send a report to a server.
        // For now, we'll just show a confirmation alert.
        console.log('Reporting listing:', {
            listingId,
            title: listingToReport.title,
            reason,
            details,
        });
        alert(`Thank you for your report. We have received your feedback regarding "${listingToReport.title}" and will review it shortly.`);
    }
  };

  const sortedListings = useMemo(() => {
    return [...allListings].sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
  }, [allListings]);


  return (
    <div className="bg-slate-100 dark:bg-gray-900 min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header 
        currentUser={currentUser}
        onPostAdClick={() => {
            if (!currentUser) {
                alert("Please log in to post an ad.");
                setIsLoginModalOpen(true);
            } else {
                setIsPostAdModalOpen(true);
            }
        }}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <HomePage 
              listings={sortedListings} 
              currentUser={currentUser} 
              onViewDetails={setSelectedListing}
              onDelete={handleDeleteListing}
              onSaveSearch={handleSaveSearch}
              onMakeOffer={handleMakeOffer}
            />
          } />
          <Route path="/profile/:userId" element={
            <ProfilePage 
              allUsers={allUsers}
              allListings={sortedListings}
              currentUser={currentUser}
              onViewDetails={setSelectedListing}
              onAddReview={handleAddReview}
              onDelete={handleDeleteListing}
              onDeleteSearch={handleDeleteSearch}
              onMakeOffer={handleMakeOffer}
            />
          } />
        </Routes>
      </main>

      <Footer />

      {selectedListing && (
        <ListingDetailModal 
          listing={selectedListing} 
          currentUser={currentUser}
          onClose={() => setSelectedListing(null)}
          onOpenChat={handleOpenChat}
          onReportListing={handleReportListing}
        />
      )}

      {isPostAdModalOpen && (
        <PostAdModal 
          isOpen={isPostAdModalOpen}
          onClose={() => setIsPostAdModalOpen(false)}
          onSubmit={handlePostAd}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onEmailLogin={handleEmailLogin}
          onEmailSignUp={handleEmailSignUp}
          onGoogleLogin={handleGoogleLogin}
        />
      )}
      
      {chatTarget && currentUser && (
          <ChatModal
              currentUser={currentUser}
              listing={chatTarget.listing}
              chatThreads={chatThreads}
              onSendMessage={handleSendMessage}
              onClose={() => setChatTarget(null)}
          />
      )}
      
      {offerListing && (
        <OfferModal 
          listing={offerListing}
          onClose={() => setOfferListing(null)}
          onSubmitOffer={handleSubmitOffer}
        />
      )}
    </div>
  );
};

export default App;