
export interface Review {
  id: string;
  author: Omit<User, 'reviews'>;
  rating: number; // 1 to 5
  comment: string;
  date: string; // ISO date string
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

export interface User {
  name: string;
  phone: string;
  email: string; // Used as a unique ID
  avatarUrl?: string;
  reviews?: Review[];
  joinDate: string; // ISO date string
  savedSearches?: SavedSearch[];
}

export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string; // This should be a subcategory id
  location: Location;
  imageUrl: string;
  postDate: string; // ISO date string
  isFeatured: boolean;
  seller: User;
}

export interface Subcategory {
  id:string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}
