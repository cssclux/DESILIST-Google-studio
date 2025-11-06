export interface Location {
  country: string;
  state: string;
  city: string;
}

export interface User {
  email: string;
  name: string;
  joinDate: string;
  avatarUrl?: string;
  reviews?: Review[];
  savedSearches?: SavedSearch[];
  password?: string;
  phone?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string; // subcategory id
  location: Location;
  imageUrls: string[];
  seller: User;
  postDate: string;
  isFeatured?: boolean;
  videoUrl?: string;
}

export interface Review {
  id: string;
  author: User;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface SavedSearch {
    id: string;
    name: string;
    searchTerm: string;
    location: {
        state: string;
        city: string;
    };
    category: {
        main: string | null;
        sub: string | null;
    };
    filters: string[];
}

// FIX: Add Message and ChatThread types for chat functionality.
export interface Message {
  id: string;
  sender: User;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  listing: Listing;
  participants: User[];
  messages: Message[];
}
